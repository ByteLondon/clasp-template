import {HolidaysBeforeFloat} from "../types/HolidayType";
import {requestTypeDecoder} from "./util";
import {floatDelete, floatPost} from "../webRequests/floatRequests";
import {FloatPayloadType} from "../types/FloatPayloadType";
import {dateCalculator, getNumberOfDays} from "./time";
import {FloatHolidays, HolidaysIDFromFloat, isHolidaysIDFromFloat} from "../types/FloatHolidaysType";

const floatFullDayRequest = (holiday: HolidaysBeforeFloat): FloatHolidays => {
    const payload: FloatPayloadType = {
        "timeoff_type_id": requestTypeDecoder(holiday.bobPolicy),
        "start_date": holiday.startDate,
        "end_date": holiday.endDate,
        "hours": 7,
        "full_day": 1,
        "people_ids": [holiday.floatID]
    }
    console.log("fullDay")

    return floatPost('timeoffs', "post", payload)
}

const floatHalfDayRequest = (holiday: HolidaysBeforeFloat): FloatHolidays => {
    const payload: FloatPayloadType = {
        "timeoff_type_id": requestTypeDecoder(holiday.bobPolicy),
        "start_date": holiday.startDate,
        "end_date": holiday.endDate,
        "start_time": (holiday.startPortion === "afternoon") ? "14:00" : "9:00",
        "hours": 4,
        "full_day": 0,
        "people_ids": [holiday.floatID]
    }
    console.log("halfDay")
    return floatPost('timeoffs', "post", payload)
}

export const floatHolidayDeleter = (holidaysToUpdate: HolidaysBeforeFloat):HolidaysIDFromFloat => {
    const beforeHoliday = holidaysToUpdate.floatRequestStartID
    const bodyHoliday = holidaysToUpdate.floatRequestBodyID
    const afterHoliday = holidaysToUpdate.floatRequestEndID

    floatDelete("timeoffs","delete",0)

    return  {
        bobID: holidaysToUpdate.bobRequestId,
        floatHolidaysStartID: (beforeHoliday ? floatDelete("timeoffs","delete",beforeHoliday):0),
        floatHolidaysBodyID: (bodyHoliday ? floatDelete("timeoffs","delete",bodyHoliday):0),
        floatHolidaysEndID: (afterHoliday ? floatDelete("timeoffs","delete",afterHoliday):0)
    }
}


export const floatHolidaySplitter = (holidaysToUpdateOriginal: HolidaysBeforeFloat):HolidaysIDFromFloat => {

    const holidaysToUpdate = JSON.parse(JSON.stringify(holidaysToUpdateOriginal))

    const numberOfDays = getNumberOfDays(holidaysToUpdate.startDate, holidaysToUpdate.endDate)

    const holidayIds: HolidaysIDFromFloat = {
        bobID: holidaysToUpdate.bobRequestId,
        floatHolidaysStartID: 0,
        floatHolidaysBodyID: 0,
        floatHolidaysEndID: 0
    }

    // Case: Less than one day and not a full day
    if (numberOfDays < 1 && holidaysToUpdate.startPortion != "full_day") {
        holidayIds.floatHolidaysBodyID=floatHalfDayRequest(holidaysToUpdate).timeoff_id

        return holidayIds
    }

    if (holidaysToUpdate.startPortion === "afternoon") {

        const changesToUpdateStart = JSON.parse(JSON.stringify(holidaysToUpdate))
        changesToUpdateStart.endDate = changesToUpdateStart.startDate

        holidayIds.floatHolidaysStartID=floatHalfDayRequest(changesToUpdateStart).timeoff_id

        holidaysToUpdate.startDate = dateCalculator(holidaysToUpdate.startDate,1 )
    }

    if (holidaysToUpdate.endPortion === "morning") {

        const changesToUpdateEnd = JSON.parse(JSON.stringify(holidaysToUpdate))
        changesToUpdateEnd.startDate = changesToUpdateEnd.endDate
        changesToUpdateEnd.startPortion = changesToUpdateEnd.endPortion

        holidayIds.floatHolidaysEndID=floatHalfDayRequest(changesToUpdateEnd).timeoff_id

        holidaysToUpdate.endDate = dateCalculator(holidaysToUpdate.startDate,-1 )
    }

    holidayIds.floatHolidaysBodyID=floatFullDayRequest(holidaysToUpdate).timeoff_id

    if(!(isHolidaysIDFromFloat(holidayIds))){
        throw new Error ("Failed to upload changes to Float")
    }

    return holidayIds
}


