import z from 'zod'
import { sign } from 'jsonwebtoken'
import mysql from 'mysql2/promise'

const refreshTokens: Record<number, Record<string, any>> = {}
export const SECRET = process.env.SECRET_TOKEN || "JwB4VUIUTsPn1FaJW6rqZwZzcvyC12MvsxNgn7uHfjc="

export default eventHandler(async (event) => {
    // const result = z.object({ username: z.string().min(1), password: z.literal('hunter2') }).safeParse(await readBody(event))
    try {
        const body = await readBody(event);
        const config = useRuntimeConfig();
        const con = await mysql.createConnection(config.mysql);
        const [data, fields] = await con.query(`SELECT * FROM admin WHERE email  = '${body.email}' AND password = '${body.password}'`)
        if ((data as []).length != 0) {
            const expiresIn = 15
            const refreshToken = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1
            const username = (data as any)[0].name
            const user = {
                username,
                picture: 'https://github.com/nuxt.png',
                name: 'User ' + username
            }
            const accessToken = sign({ ...user, scope: ['test', 'user'] }, SECRET, { expiresIn })
            refreshTokens[refreshToken] = {
                accessToken,
                user
            }
            return {
                token: {
                    accessToken,
                    refreshToken
                }
            }
        } else {
            return createError({ statusCode: 403, statusMessage: 'Unauthorized Wrong email or password' })
        }
    } catch (error) {
        return createError({
            statusCode: 500,
            data: error,
            statusMessage: `${error}`,
        });
    }
    // if (!result.success) {
    //     throw createError({ statusCode: 403, statusMessage: 'Unauthorized, hint: try `hunter2` as password' })
    // }

    // const expiresIn = 15
    // const refreshToken = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1
    // const { username } = result.data
    // const user = {
    //     username,
    //     picture: 'https://github.com/nuxt.png',
    //     name: 'User ' + username
    // }

    // const accessToken = sign({ ...user, scope: ['test', 'user'] }, SECRET, { expiresIn })
    // refreshTokens[refreshToken] = {
    //     accessToken,
    //     user
    // }

    // return {
    //     token: {
    //         accessToken,
    //         refreshToken
    //     }
    // }
})