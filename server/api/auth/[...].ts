// file: ~/server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import mysql from 'mysql2/promise'

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: process.env.SECRET_TOKEN,
  pages: {
    signIn: "/login"
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: '(hint: email)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: password)' }
      },
      async authorize(credentials: any) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!
        try {
          const config = useRuntimeConfig();
          const con = await mysql.createConnection(config.mysql);
          const [data, fields] = await con.query(`SELECT * FROM admin WHERE email  = '${credentials?.email}' AND password = '${credentials?.password}'`)
          if ((data as []).length != 0) {
            return data
          } else {
            return false
          }
        } catch (error) {
          return false
        }
      }
    })
  ]
})
