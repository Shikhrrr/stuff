import {
  MAP_EMBED_SRC,
  STORE_ADDRESS_LINES,
  openStoreDirections,
} from '../constants/storeLocation';

export default function StoreLocation() {
  return (
    <div className="min-h-screen grid-bg-subtle">
      {/* Header */}
      <div className="bg-white border-b border-[#F0E0E5] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#E8879A] uppercase tracking-widest mb-2">Visit Us</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1C1C]">Our Store</h1>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Come experience our collection in person at Purana Shivali Road, Kalyanpur, Kanpur.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden border border-[#F0E0E5] bg-[#FDF5F7]" style={{ height: '440px' }}>
              <iframe
                src={MAP_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shikhar Shoes Store Location — Kalyanpur, Kanpur"
                aria-label="Google Maps showing Shikhar Shoes at Purana Shivali Road, Kalyanpur, Kanpur"
              />
            </div>

            <button
              onClick={openStoreDirections}
              className="mt-4 inline-flex items-center gap-2 bg-[#E8879A] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#D4687C] transition-colors active:scale-[0.98]"
              aria-label="Get directions to Shikhar Shoes store"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              Get Directions
            </button>
          </div>

          {/* Info card */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-[#F0E0E5] p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FDE8EE] flex items-center justify-center text-[#E8879A]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.313-.066l.003-.001.016-.007.052-.023A10.14 10.14 0 0 0 12 17.538c.205-.221.404-.457.595-.7C14.066 14.95 16 11.89 16 8c0-3.314-2.686-6-6-6S4 4.686 4 8c0 3.89 1.934 6.95 3.405 8.838.191.243.39.479.595.7a10.144 10.144 0 0 0 1.673 1.357l.052.023.016.007Zm.31-8.933a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-[#1C1C1C]">Store Address</h2>
              </div>
              <p className="text-sm text-[#1C1C1C] font-medium mb-1">ShikharShoes</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {STORE_ADDRESS_LINES.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < STORE_ADDRESS_LINES.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#F0E0E5] p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FDE8EE] flex items-center justify-center text-[#E8879A]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-[#1C1C1C]">Store Hours</h2>
              </div>
              {[
                { day: 'Monday – Sunday', hours: '10:00 AM – 9:30 PM' },
              ].map(({ day, hours }) => (
                <div key={day} className="flex justify-between py-2 border-b border-[#F0E0E5] last:border-b-0 text-sm">
                  <span className="text-[#6B6B6B]">{day}</span>
                  <span className="font-medium text-[#1C1C1C]">{hours}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#F0E0E5] p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FDE8EE] flex items-center justify-center text-[#E8879A]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-[#1C1C1C]">Contact Us</h2>
              </div>
              <div className="flex flex-col gap-3">
                <a href="tel:+91651969763" className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#E8879A] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#E8879A]">
                    <path fillRule="evenodd" d="M1.5 2.5A1.5 1.5 0 0 1 3 1h1a1.5 1.5 0 0 1 1.43 1.053l.647 2.427a1.5 1.5 0 0 1-.82 1.718l-.492.218c-.37.163-.505.574-.3.913.755 1.27 1.666 2.235 2.907 2.906.336.183.745.063.906-.307l.218-.493a1.5 1.5 0 0 1 1.719-.82l2.427.646A1.5 1.5 0 0 1 15 11v1a1.5 1.5 0 0 1-1.5 1.5H12c-5.523 0-10-4.477-10-10V2.5Z" clipRule="evenodd"/>
                  </svg>
                  +91 96519 69763
                </a>
                <a href="mailto:dhirendrakanaujia@gmail.com" className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#E8879A] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#E8879A]">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                  </svg>
                  dhirendrakanaujia@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
