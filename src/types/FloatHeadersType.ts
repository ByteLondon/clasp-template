import {Is, isNumber, isStruct} from "../helper/guards";

export type FloatHeaders = {
    "X-Pagination-Total-Count": number,
    "X-Pagination-Page-Count": number,
    "X-Pagination-Current-Page": number,
    "X-Pagination-Per-Page": number
}

export const isFloatHeaders: Is<FloatHeaders> = isStruct({
    "X-Pagination-Total-Count": isNumber,
    "X-Pagination-Page-Count": isNumber,
    "X-Pagination-Current-Page": isNumber,
    "X-Pagination-Per-Page": isNumber
})
