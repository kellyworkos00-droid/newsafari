import apiClient from './api';

export interface BookingCreate {
  tour_id: number;
  number_of_people: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests?: string;
}

export interface Booking {
  id: number;
  tour_id: number;
  user_id: number;
  number_of_people: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  booking_reference: string;
  special_requests?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  created_at: string;
  booking_date: string;
  tour_title?: string;
  tour_location?: string;
  tour?: any;
}

export const bookingService = {
  async createBooking(data: BookingCreate): Promise<Booking> {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  async getBookings(): Promise<Booking[]> {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  async getBooking(id: number): Promise<Booking> {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  async updateBooking(id: number, data: Partial<Booking>): Promise<Booking> {
    const response = await apiClient.put(`/bookings/${id}`, data);
    return response.data;
  },

  async cancelBooking(id: number): Promise<any> {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  }
};
