import type { IBooking, IDriver, IFine, IVehicle } from '../types/entities';

/** Локальная дата-время в формате datetime-local (YYYY-MM-DDTHH:mm) со сдвигом от «сейчас». */
export function localDateTime(hoursFromNow: number): string {
    const d = new Date(Date.now() + (hoursFromNow * 3_600_000));

    return new Date(d.getTime() - (d.getTimezoneOffset() * 60_000)).toISOString()
        .slice(0, 16);
}

export const drivers: IDriver[] = [
    {
        experienceYears: 8,
        fullName: 'Смирнов Алексей Иванович',
        hiredAt: '2018-05-14',
        id: 'd1',
        licenseNumber: '16 22 123456',
        phone: '+7 917 200-11-22',
        status: 'active'
    },
    {
        experienceYears: 12,
        fullName: 'Гараев Марат Ринатович',
        hiredAt: '2016-02-01',
        id: 'd2',
        licenseNumber: '16 24 654321',
        phone: '+7 917 311-45-67',
        status: 'active'
    },
    {
        experienceYears: 5,
        fullName: 'Петров Иван Сергеевич',
        hiredAt: '2021-09-06',
        id: 'd3',
        licenseNumber: '16 27 112233',
        phone: '+7 987 400-78-90',
        status: 'vacation'
    },
    {
        experienceYears: 3,
        fullName: 'Козлов Дмитрий Павлович',
        hiredAt: '2022-11-21',
        id: 'd4',
        licenseNumber: '16 29 445566',
        phone: '+7 950 123-98-76',
        status: 'fired'
    },
    {
        experienceYears: 15,
        fullName: 'Хасанов Динар Ильдарович',
        hiredAt: '2013-04-15',
        id: 'd5',
        licenseNumber: '16 19 787878',
        phone: '+7 917 555-31-41',
        status: 'active'
    }
];

export const vehicles: IVehicle[] = [
    {
        id: 'v1',
        make: 'Ford',
        mileage: 84_500,
        model: 'Focus',
        plate: 'А123ВС16',
        status: 'active',
        vehicleType: 'sedan',
        year: 2021
    },
    {
        id: 'v2',
        make: 'Toyota',
        mileage: 12_000,
        model: 'Camry',
        plate: 'Е456НК16',
        status: 'active',
        vehicleType: 'sedan',
        year: 2023
    },
    {
        id: 'v3',
        make: 'Mercedes-Benz',
        mileage: 67_000,
        model: 'V-Class',
        plate: 'К789ОП16',
        status: 'maintenance',
        vehicleType: 'minivan',
        year: 2022
    },
    {
        id: 'v4',
        make: 'Kia',
        mileage: 152_300,
        model: 'Rio',
        plate: 'М021РТ16',
        status: 'active',
        vehicleType: 'sedan',
        year: 2019
    },
    {
        id: 'v5',
        make: 'Lada',
        mileage: 210_500,
        model: 'Largus',
        plate: 'У404НХ16',
        status: 'retired',
        vehicleType: 'wagon',
        year: 2017
    }
];

export const fines: IFine[] = [
    {
        amount: 500,
        article: '12.9 ч.2 — превышение на 20–40 км/ч',
        date: '2026-09-30',
        driverId: 'd1',
        id: 'f1',
        isPaid: true,
        vehicleId: 'v1'
    },
    {
        amount: 1_000,
        article: '12.16 — проезд на запрещающий сигнал',
        date: '2026-10-05',
        driverId: 'd5',
        id: 'f2',
        isPaid: false,
        vehicleId: 'v4'
    },
    {
        amount: 500,
        article: '12.2 — нечитаемые номера',
        date: '2026-08-21',
        driverId: null,
        id: 'f3',
        isPaid: true,
        vehicleId: 'v3'
    },
    {
        amount: 1_500,
        article: '12.9 ч.3 — превышение на 40–60 км/ч',
        date: '2026-10-12',
        driverId: 'd2',
        id: 'f4',
        isPaid: false,
        vehicleId: 'v2'
    }
];

export const bookings: IBooking[] = [
    {
        driverId: 'd1',
        endsAt: localDateTime(48),
        id: 'b1',
        purpose: 'Смена в аэропорт',
        startsAt: localDateTime(-24),
        status: 'active',
        vehicleId: 'v1'
    },
    {
        driverId: 'd2',
        endsAt: localDateTime(96),
        id: 'b2',
        purpose: 'Корпоративный заказ, весь день',
        startsAt: localDateTime(72),
        status: 'planned',
        vehicleId: 'v2'
    },
    {
        driverId: 'd5',
        endsAt: localDateTime(-48),
        id: 'b3',
        purpose: 'Доставка документов',
        startsAt: localDateTime(-96),
        status: 'completed',
        vehicleId: 'v4'
    },
    {
        driverId: 'd3',
        endsAt: localDateTime(-72),
        id: 'b4',
        purpose: 'Отменено клиентом',
        startsAt: localDateTime(-120),
        status: 'cancelled',
        vehicleId: 'v1'
    },
    {
        driverId: 'd5',
        endsAt: localDateTime(240),
        id: 'b5',
        purpose: 'Дальняя поездка — Казань → Набережные Челны',
        startsAt: localDateTime(192),
        status: 'planned',
        vehicleId: 'v4'
    }
];
