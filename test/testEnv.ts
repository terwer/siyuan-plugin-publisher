// @ts-ignore
import dotenv from 'dotenv'
import path from 'path';

/**
 * 初始化测试环境变量
 */
export const initTestEnv = () => {
    const __dirname = path.dirname(import.meta.url);
    const envPath = path.relative(process.cwd(), path.join(__dirname, '../.env.development.local')).replace("file:\\", "")
    // console.log(envPath)
    dotenv.config({path: envPath});
    // console.log(process.env.VITE_LIANDI_API_URL)
    console.log("env loaded.")
}