import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL!
})

client.on('error', err => console.log('Redis Client Error', err));
client.connect();

const set = async (key: string, value: any) => {
    await client.set(key, JSON.stringify(value))
    if (process.env.REDIS_EXPIRE) {
        await client.expire(key, parseInt(process.env.REDIS_EXPIRE!))
    }
    return
}

const get = async (key: string) => {
    const res = await client.get(key)
    if (res)
        return JSON.parse(res)
    return undefined
}

const del = async (key: string) => {
    return await client.del(key)
}

export default {
    set,
    get,
    del
}