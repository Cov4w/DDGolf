import api from './api';
import type { SmsLog } from '../types';

export const smsService = {
  sendSms: async (data: {
    recipient_ids: number[];
    message: string;
    msg_type: 'SMS' | 'LMS';
  }) => {
    const response = await api.post('/sms/send/', data);
    return response.data;
  },

  getRemain: async () => {
    const response = await api.get('/sms/remain/');
    return response.data as {
      result_code: string;
      message: string;
      SMS_CNT: number;
      LMS_CNT: number;
      MMS_CNT: number;
      point: number;
    };
  },

  getHistory: async () => {
    const response = await api.get('/sms/history/');
    return response.data as SmsLog[];
  },
};
