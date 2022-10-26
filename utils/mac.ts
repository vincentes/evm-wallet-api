import crypto from 'crypto';

export function calculate(body: any) {

    const jsonStr = JSON.stringify(body);
    const { RequestID } = body;
    const { ServerDateTime } = body;
    const key1 = `${process.env.API_KEY}:${RequestID}:${ServerDateTime}`;
    const key2 = `${process.env.API_KEY}:${jsonStr}`;

    const key2MD5 = crypto.createHash('md5').update(key2).digest('hex');

    const MAC = crypto
        .createHash('md5')
        .update(key1 + key2MD5)
        .digest('hex');

    return MAC;
}

export default {
    calculate
}