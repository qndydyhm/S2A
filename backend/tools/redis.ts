import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL!
})

client.on('error', err => console.log('Redis Client Error', err));
client.connect();

const set = async (spreadsheetId: string, sheetId: string, value: any) => {
    await client.hSet(spreadsheetId, sheetId, JSON.stringify(value))
    if (process.env.REDIS_EXPIRE) {
        await client.expire(spreadsheetId, parseInt(process.env.REDIS_EXPIRE!))
    }
    return
}

const get = async (spreadsheetId: string, sheetId: string) => {
    const res = await client.hGet(spreadsheetId, sheetId)
    return res?JSON.parse(res):undefined
}

const del = async (spreadsheetId: string) => {
    return await client.del(spreadsheetId)
}

export default {
    set,
    get,
    del
}