// file: ~/server/middleware/auth.ts
import { getServerSession } from '#auth'

export default eventHandler(async (event) => {
    // console.log(useAuth())
    // const session = await getSession({ force: true })
    // const session = await getServerSession(event)
    // const session = await $fetch('/api/auth/session', {
    //     method: 'GET',
    //     headers: event.headers
    // })

    // if (event._path?.includes("auth")) {
    //     return
    // }
    // if (event._path?.includes("api")) {
    //     if (!session) {
    //         throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
    //     } else {
    //         return
    //     }
    // }
})
