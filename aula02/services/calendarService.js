import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

// Pede permissão ao usuário
export async function requestPermission() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
}

// Busca todos os calendários do dispositivo
export async function getCalendars() {
  return await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
}

// Cria um calendário novo
export async function createCalendar() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();

  const source =
    Platform.OS === 'ios'
      ? defaultCalendar.source
      : { isLocalAccount: true, name: 'MeuApp' };

  return await Calendar.createCalendarAsync({
    title: 'Meu Calendário',
    color: '#512DA8',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: source.id,
    source: source,
    name: 'meuCalendario',
    ownerAccount: 'pessoal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
}

// Cria um evento em um calendário
export async function createEvent(calendarId) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 1);

  return await Calendar.createEventAsync(calendarId, {
    title: 'Reunião importante',
    location: 'Sala de conferências',
    startDate,
    endDate,
    timeZone: 'America/Sao_Paulo',
    notes: 'Não esquecer o relatório',
    alarms: [{ relativeOffset: -15 }],
  });
}