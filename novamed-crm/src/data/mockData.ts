import type { Appointment, AppointmentPeriodData, DepartmentPeriodData, DoctorPeriodData, Period, PeriodData } from '../types'

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
    { ...baseMetrics[3], label: 'Выручка за неделю', value: '1 284 000 ₽', delta: '+7,1%' },
  ], visitsLabel: 'Посещения за неделю', average: 36.7, visits: [{ label: 'Пн', value: 32 }, { label: 'Вт', value: 41 }, { label: 'Ср', value: 37 }, { label: 'Чт', value: 52 }, { label: 'Пт', value: 48 }, { label: 'Сб', value: 29 }, { label: 'Вс', value: 18 }] },
  month: { metrics: [
    { ...baseMetrics[0], label: 'Записей за месяц', value: '1 084', delta: '+6,2%' },
    { ...baseMetrics[1], label: 'Новых пациентов', value: '164', delta: '+18' },
    { ...baseMetrics[3], label: 'Выручка за месяц', value: '5 680 000 ₽', delta: '+5,8%' },
  ], visitsLabel: 'Посещения по неделям', average: 271, visits: [{ label: '1 нед', value: 248 }, { label: '2 нед', value: 269 }, { label: '3 нед', value: 284 }, { label: '4 нед', value: 283 }] },
}

export const appointments: Appointment[] = [
  { id: 1, time: '09:00', patient: 'Анна Смирнова', patientId: '458712', avatar: '/avatars/patients/anna-smirnova.png', service: 'Первичный приём', doctor: 'Алексей Орлов', status: 'confirmed', phone: '+7 (900) 123-45-67', note: 'Первичное обращение. Взять паспорт и результаты анализов.' },
  { id: 2, time: '10:30', patient: 'Максим Волков', patientId: '603941', avatar: '/avatars/patients/maksim-volkov.png', service: 'УЗИ', doctor: 'Елена Соколова', status: 'waiting', phone: '+7 (901) 234-56-78', note: 'Напомнить о подготовке к исследованию за два часа.' },
  { id: 3, time: '12:00', patient: 'Ольга Кузнецова', patientId: '271856', avatar: '/avatars/patients/olga-kuznetsova.png', service: 'Консультация', doctor: 'Дмитрий Лебедев', status: 'arrived', phone: '+7 (902) 345-67-89', note: 'Пациент уже зарегистрирован на стойке администратора.' },
  { id: 4, time: '14:30', patient: 'Илья Морозов', patientId: '834205', avatar: '/avatars/patients/ilya-morozov.png', service: 'Повторный приём', doctor: 'Алексей Орлов', status: 'confirmed', phone: '+7 (903) 456-78-90', note: 'Контроль после завершения курса терапии.' },
  { id: 5, time: '16:00', patient: 'Мария Павлова', patientId: '519473', avatar: '/avatars/patients/maria-pavlova.png', service: 'Кардиология', doctor: 'Ирина Новикова', status: 'cancelled', phone: '+7 (904) 567-89-01', note: 'Отменила по телефону. Предложить новую дату на следующей неделе.' },
]

export const appointmentPeriodData: Record<Period, AppointmentPeriodData> = {
  day: { title: 'Записи на сегодня', subtitle: '5 ближайших визитов', items: appointments },
  week: { title: 'Записи за неделю', subtitle: 'Последние 5 визитов из 257', items: [
    { id: 11, time: 'Пн, 09:00', patient: 'София Белова', patientId: '742618', avatar: '/avatars/patients/sofia-belova.png', service: 'Терапия', doctor: 'Алексей Орлов', status: 'confirmed', phone: '+7 (905) 112-34-56', note: 'Повторная консультация по результатам обследования.' },
    { id: 12, time: 'Вт, 11:20', patient: 'Артём Егоров', patientId: '396104', avatar: '/avatars/patients/artem-egorov.png', service: 'УЗИ', doctor: 'Елена Соколова', status: 'arrived', phone: '+7 (906) 223-45-67', note: 'Исследование проведено, заключение передано пациенту.' },
    { id: 13, time: 'Ср, 15:10', patient: 'Вера Фёдорова', patientId: '681257', avatar: '/avatars/patients/vera-fedorova.png', service: 'Кардиология', doctor: 'Ирина Новикова', status: 'confirmed', phone: '+7 (907) 334-56-78', note: 'Контроль показателей после корректировки терапии.' },
    { id: 14, time: 'Пт, 10:40', patient: 'Роман Захаров', patientId: '925340', avatar: '/avatars/patients/roman-zakharov.png', service: 'Диагностика', doctor: 'Дмитрий Лебедев', status: 'waiting', phone: '+7 (908) 445-67-89', note: 'Ожидается подтверждение дополнительных исследований.' },
    { id: 15, time: 'Сб, 13:30', patient: 'Алёна Громова', patientId: '147893', avatar: '/avatars/patients/alyona-gromova.png', service: 'Первичный приём', doctor: 'Алексей Орлов', status: 'cancelled', phone: '+7 (909) 556-78-90', note: 'Пациент попросил перенести запись на следующую неделю.' },
  ] },
  month: { title: 'Записи за месяц', subtitle: 'Последние 5 визитов из 1 084', items: [
    { id: 21, time: '03 июл, 12:00', patient: 'Кирилл Андреев', patientId: '563729', avatar: '/avatars/patients/kirill-andreev.png', service: 'Стоматология', doctor: 'Мария Лазарева', status: 'confirmed', phone: '+7 (910) 667-89-01', note: 'Плановый осмотр и составление плана лечения.' },
    { id: 22, time: '07 июл, 09:30', patient: 'Нина Тихонова', patientId: '218465', service: 'Терапия', doctor: 'Алексей Орлов', status: 'arrived', phone: '+7 (911) 778-90-12', note: 'Визит завершён, назначен контроль через месяц.' },
    { id: 23, time: '11 июл, 14:20', patient: 'Павел Сорокин', patientId: '874136', service: 'Кардиология', doctor: 'Ирина Новикова', status: 'waiting', phone: '+7 (912) 889-01-23', note: 'Необходимо подтвердить результаты суточного мониторинга.' },
    { id: 24, time: '18 июл, 16:10', patient: 'Лидия Мельникова', patientId: '435902', service: 'УЗИ', doctor: 'Елена Соколова', status: 'confirmed', phone: '+7 (913) 990-12-34', note: 'Плановое диагностическое исследование.' },
    { id: 25, time: '26 июл, 11:00', patient: 'Денис Комаров', patientId: '790351', service: 'Повторный приём', doctor: 'Дмитрий Лебедев', status: 'cancelled', phone: '+7 (914) 101-23-45', note: 'Запись отменена через личный кабинет.' },
  ] },
}

const departmentColors = ['#3568E8', '#6689D8', '#8A70A5', '#D39A56', '#A7B1B8']
const departmentNames = ['Терапия', 'Стоматология', 'Кардиология', 'Диагностика', 'Другие']
const makeDepartments = (values: number[]) => departmentNames.map((name, index) => ({ name, value: values[index], color: departmentColors[index] }))

export const departmentPeriodData: Record<Period, DepartmentPeriodData> = {
  day: { total: 24, subtitle: 'Структура записей сегодня', items: makeDepartments([35, 25, 18, 14, 8]) },
  week: { total: 257, subtitle: 'Структура записей за неделю', items: makeDepartments([32, 27, 19, 15, 7]) },
  month: { total: 1084, subtitle: 'Структура записей за месяц', items: makeDepartments([30, 26, 20, 16, 8]) },
}

export const doctorPeriodData: Record<Period, DoctorPeriodData> = {
  day: { subtitle: 'Текущая смена · 12 специалистов', items: [
    { name: 'Алексей Орлов', specialty: 'Терапевт', appointments: 8, load: 80, initials: 'АО', tone: '#E4EAFC' },
    { name: 'Елена Соколова', specialty: 'Врач УЗИ', appointments: 6, load: 60, initials: 'ЕС', tone: '#E3EBF3' },
    { name: 'Ирина Новикова', specialty: 'Кардиолог', appointments: 9, load: 90, initials: 'ИН', tone: '#EEE7F3' },
  ] },
  week: { subtitle: 'Средняя загрузка за неделю', items: [
    { name: 'Алексей Орлов', specialty: 'Терапевт', appointments: 42, load: 84, initials: 'АО', tone: '#E4EAFC' },
    { name: 'Елена Соколова', specialty: 'Врач УЗИ', appointments: 31, load: 72, initials: 'ЕС', tone: '#E3EBF3' },
    { name: 'Ирина Новикова', specialty: 'Кардиолог', appointments: 38, load: 88, initials: 'ИН', tone: '#EEE7F3' },
  ] },
  month: { subtitle: 'Средняя загрузка за месяц', items: [
    { name: 'Алексей Орлов', specialty: 'Терапевт', appointments: 174, load: 87, initials: 'АО', tone: '#E4EAFC' },
    { name: 'Елена Соколова', specialty: 'Врач УЗИ', appointments: 128, load: 74, initials: 'ЕС', tone: '#E3EBF3' },
    { name: 'Ирина Новикова', specialty: 'Кардиолог', appointments: 156, load: 92, initials: 'ИН', tone: '#EEE7F3' },
  ] },
}
