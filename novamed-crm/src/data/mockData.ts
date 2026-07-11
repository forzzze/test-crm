import type { Appointment, Department, Doctor, Period, PeriodData } from '../types'

const baseMetrics = [
  { id: 'appointments', label: 'Записей сегодня', value: '24', delta: '+12%', direction: 'up' as const, icon: 'calendar' as const },
  { id: 'patients', label: 'Новых пациентов', value: '7', delta: '+2', direction: 'up' as const, icon: 'patients' as const },
  { id: 'doctors', label: 'Врачей на смене', value: '12', delta: 'без изменений', direction: 'neutral' as const, icon: 'doctors' as const },
  { id: 'revenue', label: 'Выручка за день', value: '186 400 ₽', delta: '+8,4%', direction: 'up' as const, icon: 'revenue' as const },
]

export const periodData: Record<Period, PeriodData> = {
  day: { metrics: baseMetrics, visitsLabel: 'Динамика по времени', average: 3.4, visits: [{ label: '08', value: 1 }, { label: '10', value: 4 }, { label: '12', value: 6 }, { label: '14', value: 3 }, { label: '16', value: 5 }, { label: '18', value: 3 }, { label: '20', value: 2 }] },
  week: { metrics: [
    { ...baseMetrics[0], label: 'Записей за неделю', value: '257', delta: '+9,6%' },
    { ...baseMetrics[1], label: 'Новых пациентов', value: '42', delta: '+11%' },
    { ...baseMetrics[2], label: 'Среднее врачей', value: '11', delta: '+1', direction: 'up' },
    { ...baseMetrics[3], label: 'Выручка за неделю', value: '1 284 000 ₽', delta: '+7,1%' },
  ], visitsLabel: 'Посещения за неделю', average: 36.7, visits: [{ label: 'Пн', value: 32 }, { label: 'Вт', value: 41 }, { label: 'Ср', value: 37 }, { label: 'Чт', value: 52 }, { label: 'Пт', value: 48 }, { label: 'Сб', value: 29 }, { label: 'Вс', value: 18 }] },
  month: { metrics: [
    { ...baseMetrics[0], label: 'Записей за месяц', value: '1 084', delta: '+6,2%' },
    { ...baseMetrics[1], label: 'Новых пациентов', value: '164', delta: '+18' },
    { ...baseMetrics[2], label: 'Среднее врачей', value: '11,6', delta: '+0,4', direction: 'up' },
    { ...baseMetrics[3], label: 'Выручка за месяц', value: '5 680 000 ₽', delta: '+5,8%' },
  ], visitsLabel: 'Посещения по неделям', average: 271, visits: [{ label: '1 нед', value: 248 }, { label: '2 нед', value: 269 }, { label: '3 нед', value: 284 }, { label: '4 нед', value: 283 }] },
}

export const appointments: Appointment[] = [
  { id: 1, time: '09:00', patient: 'Анна Смирнова', service: 'Первичный приём', doctor: 'Алексей Орлов', status: 'confirmed', phone: '+7 (900) 123-45-67', note: 'Первичное обращение. Взять паспорт и результаты анализов.' },
  { id: 2, time: '10:30', patient: 'Максим Волков', service: 'УЗИ', doctor: 'Елена Соколова', status: 'waiting', phone: '+7 (901) 234-56-78', note: 'Напомнить о подготовке к исследованию за два часа.' },
  { id: 3, time: '12:00', patient: 'Ольга Кузнецова', service: 'Консультация', doctor: 'Дмитрий Лебедев', status: 'arrived', phone: '+7 (902) 345-67-89', note: 'Пациент уже зарегистрирован на стойке администратора.' },
  { id: 4, time: '14:30', patient: 'Илья Морозов', service: 'Повторный приём', doctor: 'Алексей Орлов', status: 'confirmed', phone: '+7 (903) 456-78-90', note: 'Контроль после завершения курса терапии.' },
  { id: 5, time: '16:00', patient: 'Мария Павлова', service: 'Кардиология', doctor: 'Ирина Новикова', status: 'cancelled', phone: '+7 (904) 567-89-01', note: 'Отменила по телефону. Предложить новую дату на следующей неделе.' },
]

export const departments: Department[] = [
  { name: 'Терапия', value: 35, color: '#3568E8' }, { name: 'Стоматология', value: 25, color: '#6689D8' }, { name: 'Кардиология', value: 18, color: '#8A70A5' }, { name: 'Диагностика', value: 14, color: '#D39A56' }, { name: 'Другие', value: 8, color: '#A7B1B8' },
]

export const doctors: Doctor[] = [
  { name: 'Алексей Орлов', specialty: 'Терапевт', appointments: 8, load: 80, initials: 'АО', tone: '#E4EAFC' },
  { name: 'Елена Соколова', specialty: 'Врач УЗИ', appointments: 6, load: 60, initials: 'ЕС', tone: '#E3EBF3' },
  { name: 'Ирина Новикова', specialty: 'Кардиолог', appointments: 9, load: 90, initials: 'ИН', tone: '#EEE7F3' },
]
