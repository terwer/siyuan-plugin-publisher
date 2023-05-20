import { JSONSchemaType } from "ajv";
/**
 * 校验 JSON schema
 *
 * @author terwer
 * @version 1.5.0
 * @since 1.5.0
 */
declare class JsonUtil {
    private ajv;
    constructor();
    validateJson<T>(schema: JSONSchemaType<T>, data: T): {
        valid: boolean;
        error?: string;
    };
    validateObjectSchema(schemaObject: object, dataObject: object): {
        valid: boolean;
        error?: string;
    };
}
export default JsonUtil;
