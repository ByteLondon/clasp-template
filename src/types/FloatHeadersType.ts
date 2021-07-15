import {Is, isOptional, isString, isStruct} from "../helper/guards";

export type FloatHeaders = {
    "x-pagination-total-count"?: string,
    "x-pagination-page-count": string,
    "x-pagination-current-page"?: string,
    "x-pagination-per-page"?: string
}

export const isFloatHeaders: Is<FloatHeaders> = isStruct({
    "x-pagination-total-count": isOptional(isString),
    "x-pagination-page-count": isString,
    "x-pagination-current-page": isOptional(isString),
    "x-pagination-per-page": isOptional(isString)
})
