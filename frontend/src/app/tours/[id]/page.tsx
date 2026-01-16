'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { tourService } from '@/lib/tours';
import { Tour } from '@/types/tour';

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  useEffect(() => {
    fetchTourDetails();
  }, [params.id]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      const data = await tourService.getTour(Number(params.id));
      setTour(data);
    } catch (error) {
      console.error('Failed to fetch tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    router.push(`/booking/${params.id}?people=${numberOfPeople}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour not found</h2>
          <Link href="/tours" className="text-green-600 hover:text-green-700">
            Back to tours
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = tour.price_per_person * numberOfPeople;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/tours" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tours
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="h-96 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-700">
                  {tour.category}
                </span>
              </div>
            </div>

            {/* Tour Info */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{tour.title}</h1>
              
              <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {tour.destination}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tour.duration_days} Days
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {tour.min_participants}-{tour.max_participants || '∞'} People
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
              </div>

              {tour.includes && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                  <div className="text-gray-700 whitespace-pre-line">{tour.includes}</div>
                </div>
              )}

              {tour.excludes && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h3>
                  <div className="text-gray-700 whitespace-pre-line">{tour.excludes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Price per person</div>
                <div className="text-4xl font-extrabold text-green-600">${tour.price_per_person}</div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-green-600 hover:text-green-600 font-bold transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Math.max(1, Math.min(tour.max_participants || 100, Number(e.target.value))))}
                    className="flex-1 text-center text-xl font-bold py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    min="1"
                    max={tour.max_participants || 100}
                  />
                  <button
                    onClick={() => setNumberOfPeople(Math.min(tour.max_participants || 100, numberOfPeople + 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-green-600 hover:text-green-600 font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">${tour.price_per_person} × {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</span>
                  <span className="font-semibold">${tour.price_per_person * numberOfPeople}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-green-600">${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                Book Now
              </button>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free cancellation up to 24 hours before
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instant confirmation
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure M-PESA payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
