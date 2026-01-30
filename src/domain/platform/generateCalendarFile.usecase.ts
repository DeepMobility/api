import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class GenerateCalendarFileUsecase {
  /**
   * Generate an iCalendar (.ics) file content for a recurring daily reminder
   * @param time - Time in HH:MM format (e.g., "08:00")
   * @returns iCalendar file content as string
   */
  generate(time: string): string {
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      throw new BadRequestException('Invalid time format. Use HH:MM (e.g., 08:00)');
    }

    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new BadRequestException('Invalid time value');
    }

    return this.generateICalContent(time);
  }

  private getReminderMessageForTime(time: string): { emoji: string; message: string } {
    const [hours] = time.split(':');
    const hour = parseInt(hours);

    if (hour >= 6 && hour < 7) {
      return {
        emoji: '🌅',
        message: 'On bondit du lit ! 6 minutes de micro-routine DeepMobility avant même le café. Le meilleur réveil pour ton corps.'
      };
    } else if (hour >= 7 && hour < 8) {
      return {
        emoji: '🪥',
        message: 'Avant le brossage de dents (3 brossages = ta routine DeepMobility) : fais bouger ton corps avant de faire briller ton sourire.'
      };
    } else if (hour >= 8 && hour < 10) {
      return {
        emoji: '⚡',
        message: 'Allez, on active la machine ! 6 minutes pour réveiller les muscles et lancer la journée du bon pied.'
      };
    } else if (hour >= 10 && hour < 12) {
      return {
        emoji: '🚭',
        message: 'Pause clope ? Oublie-la. 6 minutes de DeepMobility, c\'est le même temps, mais bien plus sain. On fait bouger les épaules et on détend le dos.'
      };
    } else if (hour >= 12 && hour < 14) {
      return {
        emoji: '🍽️',
        message: 'Entre deux bouchées, prends 6 minutes pour relancer digestion et énergie. Ta routine DeepMobility post-déjeuner t\'attend.'
      };
    } else if (hour >= 14 && hour < 16) {
      return {
        emoji: '🥱',
        message: 'Coup de mou ? C\'est le moment parfait pour t\'étirer, relancer la circulation et éviter la posture "statue de bureau". 6 minutes top chrono.'
      };
    } else if (hour >= 16 && hour < 18) {
      return {
        emoji: '💪',
        message: 'Pause mobilité express. On libère les tensions, on s\'étire et on finit la journée plus léger qu\'on l\'a commencée.'
      };
    } else if (hour >= 18 && hour < 20) {
      return {
        emoji: '🏃',
        message: 'Fin de journée, mais pas fin de mouvement. Que tu aies été assis, debout ou en action, accorde-toi 6 minutes pour relancer le corps, détendre les zones sollicitées et prévenir les douleurs du quotidien.'
      };
    } else if (hour >= 20 && hour < 21) {
      return {
        emoji: '🌙',
        message: 'Routine douceur du soir : quelques mouvements pour libérer les tensions accumulées et préparer une nuit paisible.'
      };
    } else if (hour >= 21 && hour < 22) {
      return {
        emoji: '📱',
        message: 'Lâche ton écran, garde le mouvement. Une micro-routine DeepMobility pour finir la journée en souplesse et bien-être.'
      };
    } else {
      return {
        emoji: '🧘',
        message: 'C\'est l\'heure de votre routine bien-être quotidienne ! Prenez quelques minutes pour prendre soin de vous et améliorer votre mobilité.'
      };
    }
  }

  private generateICalContent(reminderTime: string): string {
    const [hours, minutes] = reminderTime.split(':');

    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hours),
      parseInt(minutes),
    );

    const endDate = new Date(startDate.getTime() + 6 * 60000);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const sec = String(date.getSeconds()).padStart(2, '0');
      return `${year}${month}${day}T${hour}${min}${sec}`;
    };

    const uid = `deepmobility-reminder-${reminderTime.replace(':', '')}@deepmobility.fr`;
    const dtstamp = formatDate(now);
    const dtstart = formatDate(startDate);
    const dtend = formatDate(endDate);

    const { emoji, message } = this.getReminderMessageForTime(reminderTime);

    const title = `${emoji} Rappel DeepMobility - Votre routine bien-être`;
    const description = `${message}\\n\\nRendez-vous sur votre plateforme DeepMobility.`;

    const icalLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DeepMobility//Reminder//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Rappel DeepMobility',
      'X-WR-TIMEZONE:Europe/Paris',
      'BEGIN:VTIMEZONE',
      'TZID:Europe/Paris',
      'BEGIN:DAYLIGHT',
      'TZOFFSETFROM:+0100',
      'TZOFFSETTO:+0200',
      'TZNAME:CEST',
      'DTSTART:19700329T020000',
      'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
      'END:DAYLIGHT',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0200',
      'TZOFFSETTO:+0100',
      'TZNAME:CET',
      'DTSTART:19701025T030000',
      'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=Europe/Paris:${dtstart}`,
      `DTEND;TZID=Europe/Paris:${dtend}`,
      'RRULE:FREQ=DAILY',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'LOCATION:DeepMobility',
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Rappel DeepMobility',
      'TRIGGER:-PT5M',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    return icalLines.join('\r\n');
  }
}
