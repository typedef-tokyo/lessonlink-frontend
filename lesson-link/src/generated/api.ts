import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const presenter_CampusListDTO = z
  .object({ campus: z.string(), campus_name: z.string() })
  .passthrough();
const presenter_CampusListResponse = z
  .object({ campuses: z.array(presenter_CampusListDTO), msg: z.string() })
  .passthrough();
const controller_LessonAddRequestData = z
  .object({ duration: z.number().int(), lesson_name: z.string() })
  .passthrough();
const presenter_LessonAddResponse = z.object({ msg: z.string() }).passthrough();
const presenter_LessonListDTO = z
  .object({
    id: z.number().int(),
    lesson_duration: z.number().int(),
    lesson_name: z.string(),
  })
  .passthrough();
const presenter_LessonListResponse = z
  .object({ lessons: z.array(presenter_LessonListDTO) })
  .passthrough();
const controller_LessonEditRequestData = z
  .object({ duration: z.number().int(), lesson_name: z.string() })
  .passthrough();
const presenter_LessonEditResponse = z
  .object({ msg: z.string() })
  .passthrough();
const controller_RoomEditData = z
  .object({ room_index: z.number().int(), room_name: z.string() })
  .passthrough();
const controller_RoomEditRequestData = z
  .object({ room_list: z.array(controller_RoomEditData) })
  .passthrough();
const presenter_RoomEditResponse = z.object({ msg: z.string() }).passthrough();
const presenter_RoomListDTO = z
  .object({ room_index: z.number().int(), room_name: z.string() })
  .passthrough();
const presenter_RoomListResponse = z
  .object({ rooms: z.array(presenter_RoomListDTO) })
  .passthrough();
const presenter_ScheduleLessonItem = z
  .object({
    duration: z.number().int(),
    identifier: z.string(),
    lesson_id: z.number().int(),
    lesson_name: z.string(),
  })
  .passthrough();
const presenter_ScheduleRoomLesson = z
  .object({
    duration: z.number().int(),
    end_time_hour: z.number().int(),
    end_time_minutes: z.number().int(),
    identifier: z.string(),
    item_tag: z.string(),
    lesson_id: z.number().int(),
    lesson_name: z.string(),
    room_index: z.number().int(),
    start_time_hour: z.number().int(),
    start_time_minutes: z.number().int(),
  })
  .passthrough();
const presenter_ScheduleRoomDTO = z
  .object({
    room_index: z.number().int(),
    room_name: z.string(),
    visible: z.boolean(),
  })
  .passthrough();
const presenter_ScheduleGetResponse = z
  .object({
    campus: z.string(),
    created_user_id: z.number().int(),
    history_index: z.number().int(),
    lesson_item_list: z.array(presenter_ScheduleLessonItem),
    room_lesson_list: z.array(presenter_ScheduleRoomLesson),
    rooms: z.array(presenter_ScheduleRoomDTO),
    schedule_end_time: z.number().int(),
    schedule_id: z.number().int(),
    schedule_start_time: z.number().int(),
    title: z.string(),
  })
  .passthrough();
const controller_ScheduleSaveRequestData = z
  .object({ history_index: z.number().int() })
  .passthrough();
const presenter_ScheduleSaveResponse = z
  .object({ history_index: z.number().int(), msg: z.string() })
  .passthrough();
const controller_ScheduleItemDivideRequestData = z
  .object({
    divide_minutes: z.number().int(),
    history_index: z.number().int(),
    identifier: z.string(),
    lesson_id: z.number().int(),
  })
  .passthrough();
const presenter_ScheduleItemEditLessonItem = z
  .object({
    duration: z.number().int(),
    identifier: z.string(),
    lesson_id: z.number().int(),
    lesson_name: z.string(),
  })
  .passthrough();
const presenter_ScheduleItemEditRoomLesson = z
  .object({
    duration: z.number().int(),
    end_time_hour: z.number().int(),
    end_time_minutes: z.number().int(),
    identifier: z.string(),
    item_tag: z.string(),
    lesson_id: z.number().int(),
    lesson_name: z.string(),
    room_index: z.number().int(),
    start_time_hour: z.number().int(),
    start_time_minutes: z.number().int(),
  })
  .passthrough();
const presenter_ScheduleItemEditResponse = z
  .object({
    history_index: z.number().int(),
    lesson_item_list: z.array(presenter_ScheduleItemEditLessonItem),
    room_lesson_list: z.array(presenter_ScheduleItemEditRoomLesson),
  })
  .passthrough();
const controller_ScheduleItemJoinRequestData = z
  .object({
    history_index: z.number().int(),
    join_from_identifier: z.string(),
    join_to_identifier: z.string(),
  })
  .passthrough();
const controller_ScheduleItemMoveRequestData = z
  .object({
    duration: z.number().int(),
    end_time_hour: z.number().int(),
    end_time_minutes: z.number().int(),
    history_index: z.number().int(),
    identifier: z.string(),
    item_tag: z.string(),
    lesson_id: z.number().int(),
    room_index: z.number().int(),
    start_time_hour: z.number().int(),
    start_time_minute: z.number().int(),
  })
  .passthrough();
const controller_ScheduleItemReturnListRequestData = z
  .object({
    duration: z.number().int(),
    history_index: z.number().int(),
    identifier: z.string(),
    lesson_id: z.number().int(),
  })
  .passthrough();
const controller_ScheduleItemShiftRequestData = z
  .object({ history_index: z.number().int(), room_index: z.number().int() })
  .passthrough();
const controller_InvisibleRoomSaveRequestData = z
  .object({ invisible_rooms: z.array(z.number().int()) })
  .passthrough();
const presenter_InvisibleRoomSaveResponse = z
  .object({ msg: z.string() })
  .passthrough();
const controller_ScheduleTimeEditRequestData = z
  .object({ end_time: z.number().int(), start_time: z.number().int() })
  .passthrough();
const controller_ScheduleSaveTitleRequestData = z
  .object({ title: z.string() })
  .passthrough();
const presenter_ScheduleSaveTitleResponse = z
  .object({ msg: z.string() })
  .passthrough();
const controller_ScheduleCreateRequestData = z
  .object({ end_time: z.number().int(), start_time: z.number().int() })
  .passthrough();
const presenter_ScheduleCreateResponse = z
  .object({ schedule_id: z.number().int() })
  .passthrough();
const presenter_ScheduleListDTO = z
  .object({
    created_user_id: z.number().int(),
    created_user_name: z.string(),
    last_update_date_time: z.string(),
    last_update_user_name: z.string(),
    schedule_id: z.number().int(),
    title: z.string(),
  })
  .passthrough();
const presenter_ScheduleListResponse = z
  .object({ schedules: z.array(presenter_ScheduleListDTO) })
  .passthrough();
const controller_UserAddRequestData = z
  .object({
    confirm_password: z.string(),
    name: z.string(),
    password: z.string(),
    role_key: z.string(),
    user_name: z.string(),
  })
  .passthrough();
const presenter_UserAddResponse = z.object({ msg: z.string() }).passthrough();
const controller_UserUpdateRequestData = z
  .object({
    confirm_password: z.string(),
    display_name: z.string(),
    id: z.number().int(),
    password: z.string(),
    role_key: z.string(),
    user_name: z.string(),
  })
  .passthrough();
const presenter_UserUpdateResponse = z
  .object({ msg: z.string() })
  .passthrough();
const presenter_UserDeleteResponse = z
  .object({ msg: z.string() })
  .passthrough();
const presenter_UserGetResponse = z
  .object({
    id: z.number().int(),
    name: z.string(),
    role_key: z.string(),
    user_name: z.string(),
  })
  .passthrough();
const presenter_UserDTO = z
  .object({
    id: z.number().int(),
    name: z.string(),
    role_name: z.string(),
    user_name: z.string(),
  })
  .passthrough();
const presenter_UserListResponse = z
  .object({ users: z.array(presenter_UserDTO) })
  .passthrough();
const controller_UserLoginParams = z
  .object({ password: z.string(), user_name: z.string() })
  .passthrough();
const presenter_LoginUserDTO = z
  .object({
    id: z.number().int(),
    name: z.string(),
    role_key: z.string(),
    user_name: z.string(),
  })
  .passthrough();
const presenter_UserLoginResponse = z
  .object({ login_user: presenter_LoginUserDTO, msg: z.string() })
  .passthrough();

export const schemas = {
  presenter_CampusListDTO,
  presenter_CampusListResponse,
  controller_LessonAddRequestData,
  presenter_LessonAddResponse,
  presenter_LessonListDTO,
  presenter_LessonListResponse,
  controller_LessonEditRequestData,
  presenter_LessonEditResponse,
  controller_RoomEditData,
  controller_RoomEditRequestData,
  presenter_RoomEditResponse,
  presenter_RoomListDTO,
  presenter_RoomListResponse,
  presenter_ScheduleLessonItem,
  presenter_ScheduleRoomLesson,
  presenter_ScheduleRoomDTO,
  presenter_ScheduleGetResponse,
  controller_ScheduleSaveRequestData,
  presenter_ScheduleSaveResponse,
  controller_ScheduleItemDivideRequestData,
  presenter_ScheduleItemEditLessonItem,
  presenter_ScheduleItemEditRoomLesson,
  presenter_ScheduleItemEditResponse,
  controller_ScheduleItemJoinRequestData,
  controller_ScheduleItemMoveRequestData,
  controller_ScheduleItemReturnListRequestData,
  controller_ScheduleItemShiftRequestData,
  controller_InvisibleRoomSaveRequestData,
  presenter_InvisibleRoomSaveResponse,
  controller_ScheduleTimeEditRequestData,
  controller_ScheduleSaveTitleRequestData,
  presenter_ScheduleSaveTitleResponse,
  controller_ScheduleCreateRequestData,
  presenter_ScheduleCreateResponse,
  presenter_ScheduleListDTO,
  presenter_ScheduleListResponse,
  controller_UserAddRequestData,
  presenter_UserAddResponse,
  controller_UserUpdateRequestData,
  presenter_UserUpdateResponse,
  presenter_UserDeleteResponse,
  presenter_UserGetResponse,
  presenter_UserDTO,
  presenter_UserListResponse,
  controller_UserLoginParams,
  presenter_LoginUserDTO,
  presenter_UserLoginResponse,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/campus/list",
    alias: "getCampuslist",
    requestFormat: "json",
    response: presenter_CampusListResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/lesson/:campus",
    alias: "postLessonCampus",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `講座追加リクエスト`,
        type: "Body",
        schema: controller_LessonAddRequestData,
      },
      {
        name: "campus",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ msg: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "get",
    path: "/lesson/:campus/list",
    alias: "getLessonCampuslist",
    requestFormat: "json",
    parameters: [
      {
        name: "campus",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: presenter_LessonListResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "patch",
    path: "/lesson/:lessonid",
    alias: "patchLessonLessonid",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `講座編集リクエスト`,
        type: "Body",
        schema: controller_LessonEditRequestData,
      },
      {
        name: "lessonid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ msg: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/room/:campus/edit",
    alias: "postRoomCampusedit",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `教室編集リクエスト`,
        type: "Body",
        schema: controller_RoomEditRequestData,
      },
      {
        name: "campus",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ msg: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "get",
    path: "/room/:campus/list",
    alias: "getRoomCampuslist",
    requestFormat: "json",
    parameters: [
      {
        name: "campus",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: presenter_RoomListResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "delete",
    path: "/schedule/:schedule_id",
    alias: "deleteScheduleSchedule_id",
    requestFormat: "json",
    parameters: [
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "get",
    path: "/schedule/:schedule_id",
    alias: "getScheduleSchedule_id",
    requestFormat: "json",
    parameters: [
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
      {
        name: "history",
        type: "Query",
        schema: z.number().int().optional(),
      },
    ],
    response: presenter_ScheduleGetResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/schedule/:schedule_id",
    alias: "postScheduleSchedule_id",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `スケジュール保存リクエスト`,
        type: "Body",
        schema: z.object({ history_index: z.number().int() }).passthrough(),
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: presenter_ScheduleSaveResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/schedule/:schedule_id/duplicate",
    alias: "postScheduleSchedule_idduplicate",
    requestFormat: "json",
    parameters: [
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/schedule/:schedule_id/item-divide",
    alias: "postScheduleSchedule_iditemDivide",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `スケジュール保存リクエスト`,
        type: "Body",
        schema: controller_ScheduleItemDivideRequestData,
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: presenter_ScheduleItemEditResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/schedule/:schedule_id/item-join",
    alias: "postScheduleSchedule_iditemJoin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `アイテム結合リクエスト`,
        type: "Body",
        schema: controller_ScheduleItemJoinRequestData,
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: presenter_ScheduleItemEditResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/schedule/:schedule_id/item-move",
    alias: "postScheduleSchedule_iditemMove",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `アイテム移動リクエスト`,
        type: "Body",
        schema: controller_ScheduleItemMoveRequestData,
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: presenter_ScheduleItemEditResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/schedule/:schedule_id/item-return-list",
    alias: "postScheduleSchedule_iditemReturnList",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `アイテムリスト移動リクエスト`,
        type: "Body",
        schema: controller_ScheduleItemReturnListRequestData,
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: presenter_ScheduleItemEditResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/schedule/:schedule_id/item-shift",
    alias: "postScheduleSchedule_iditemShift",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `アイテムシフトリクエスト`,
        type: "Body",
        schema: controller_ScheduleItemShiftRequestData,
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: presenter_ScheduleItemEditResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "put",
    path: "/schedule/:schedule_id/room/invisible",
    alias: "putScheduleSchedule_idroominvisible",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `非表示ルームリクエスト`,
        type: "Body",
        schema: controller_InvisibleRoomSaveRequestData,
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ msg: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "patch",
    path: "/schedule/:schedule_id/time",
    alias: "patchScheduleSchedule_idtime",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `スケジュール時間変更リクエスト`,
        type: "Body",
        schema: controller_ScheduleTimeEditRequestData,
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: presenter_ScheduleItemEditResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "patch",
    path: "/schedule/:schedule_id/title",
    alias: "patchScheduleSchedule_idtitle",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `タイトル保存リクエスト`,
        type: "Body",
        schema: z.object({ title: z.string() }).passthrough(),
      },
      {
        name: "schedule_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ msg: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/schedule/create/:campus",
    alias: "postSchedulecreateCampus",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `スケジュール作成リクエスト`,
        type: "Body",
        schema: controller_ScheduleCreateRequestData,
      },
      {
        name: "campus",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ schedule_id: z.number().int() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "get",
    path: "/schedule/list/:campus",
    alias: "getSchedulelistCampus",
    requestFormat: "json",
    parameters: [
      {
        name: "campus",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: presenter_ScheduleListResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/user",
    alias: "postUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `ユーザー作成リクエスト`,
        type: "Body",
        schema: controller_UserAddRequestData,
      },
    ],
    response: z.object({ msg: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 409,
        description: `Conflict`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "put",
    path: "/user",
    alias: "putUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `ユーザー更新リクエスト`,
        type: "Body",
        schema: controller_UserUpdateRequestData,
      },
    ],
    response: z.object({ msg: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "delete",
    path: "/user/:userid",
    alias: "deleteUserUserid",
    requestFormat: "json",
    parameters: [
      {
        name: "userid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ msg: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "get",
    path: "/user/:userid",
    alias: "getUserUserid",
    requestFormat: "json",
    parameters: [
      {
        name: "userid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: presenter_UserGetResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "get",
    path: "/user/list",
    alias: "getUserlist",
    requestFormat: "json",
    response: presenter_UserListResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
  {
    method: "post",
    path: "/user/login",
    alias: "postUserlogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `ユーザーログイン情報`,
        type: "Body",
        schema: controller_UserLoginParams,
      },
    ],
    response: presenter_UserLoginResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: presenter_UserLoginResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: presenter_UserLoginResponse,
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: presenter_UserLoginResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/user/logout",
    alias: "postUserlogout",
    requestFormat: "json",
    response: z.string(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.string(),
      },
    ],
  },
  {
    method: "get",
    path: "/user/self",
    alias: "getUserself",
    requestFormat: "json",
    response: presenter_UserGetResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.record(z.string()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.record(z.string()),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.record(z.string()),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
