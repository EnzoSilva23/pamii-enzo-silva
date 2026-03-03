import { useState } from 'react';
import * as calendarService from '../services/calendarService';

export function useCalendar() {
  const [loading, setLoading] = useState(false);
  const [calendarId, setCalendarId] = useState(null);

  // Inicializa: pede permissão e cria o calendário
  async function init() {
    setLoading(true);
    const granted = await calendarService.requestPermission();

    if (!granted) {
      alert('Permissão negada!');
      setLoading(false);
      return;
    }

    const id = await calendarService.createCalendar();
    setCalendarId(id);
    setLoading(false);
  }

  // Cria evento usando o calendário já criado
  async function addEvent() {
    if (!calendarId) return alert('Inicialize o calendário primeiro!');
    const eventId = await calendarService.createEvent(calendarId);
    alert('Evento criado! ID: ' + eventId);
  }

  return { init, addEvent, loading, calendarId };
}