// Footer.jsx
export default function Footer() {
  return (
    <footer className="w-full max-w-320 mx-auto bg-[#F5F5F5] text-black py-4 px-4 sm:px-8 md:px-12 lg:px-16  ">
    
        <div className="flex flex-col sm:flex-col-2 md:flex-row ">
          {/* Left Section */}
          <div className="w-full md:w-1/2 flex flex-col-2 sm:flex-row mb-6 md:mb-0 ">
            {/* Block 1 */}
            <div className="w-full sm:w-1/2 mb-6 sm:mb-0 ">
              <h3 className="text-lg font-medium mb-4 uppercase">Collections</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:underline">Black teas</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Green teas</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">White teas</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Herbal teas</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Matcha</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Chai</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Oolong</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Rooibos</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Teaware</a>
                </li>
              </ul>
            </div>
            {/* Block 2 */}
            <div className="w-full sm:w-1/2">
              <h3 className="text-lg font-medium mb-4 uppercase">LEARN</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:underline">About us</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">About our teas</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Tea academy</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 flex flex-col sm:flex-row ">
            {/* Block 3 */}
            <div className=" sm:w-1/2 mb-6 sm:mb-0">
              <h3 className="text-lg font-medium mb-4 uppercase">CUSTOMER SERVICE</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:underline">Ordering and payment</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Delivery</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Privacy and policy</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Terms & Conditions</a>
                </li>
              </ul>
            </div>
            {/* Block 4 */}
            <div className="sm:w-1/2">
              <h3 className="text-lg font-medium mb-4 uppercase">CONTACT US</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="flex items-start hover:underline">
                    <svg
                      className="w-5 h-5 mr-2 text-black mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z"
                      />
                      <circle cx="12" cy="9" r="2" fill="currentColor" />
                    </svg>
                    <span>3 Falahi, Falahi St, Pasdaran Ave,<br />Shiraz, Fars Province,<br />Iran</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:underline">
                    <svg
                      className="w-5 h-5 mr-2 text-black flex-shrink-0"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 
                                0-2 .9-2 2v12c0 1.1.9 2 2 
                                2h16c1.1 0 2-.9 2-2V6zm-2 
                                0l-8 5-8-5h16zm0 
                                12H4V8l8 5 8-5v10z" />
                    </svg>
                    <span>Email: amoopur@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:underline">
                    <svg 
                      className="w-4.5 h-4.5 mr-2 text-black flex-shrink-0" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg" 
                      stroke="currentColor" 
                      fill="none" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>Tel: +98 9173038406</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
     
    </footer>
  );
}