// file: ~/server/middleware/auth.ts
import { getServerSession } from '#auth'

export default eventHandler(async (event) => {
    const session = await getServerSession(event)
    if (event._path?.includes("login") || event._path?.includes("auth")) {
        return
    }
    if (!session) {
        throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
    }
})
