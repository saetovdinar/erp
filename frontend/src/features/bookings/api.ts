// HTTP-доступ к данным бронирований: валидация и бизнес-правила — на API.

import { createCrudApi } from '../../api/client';

import type { IBooking, IBookingInput } from './types';

export const bookingsApi = createCrudApi<IBooking, IBookingInput>('/v1/bookings');
