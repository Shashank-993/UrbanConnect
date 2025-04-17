import React from "react";
import { Link } from "react-router-dom";
import illustration from "./images/illustration.svg";

export const Tailwind = () => {
  return (
    <div>
      {/* NAVBAR */}
      <nav className="relative tailwind-container w-11/12 mx-auto  p-3 bg-gray-200 border-2 border-solid border-gray-300 rounded-full shadow-md inset-3">
        <div className="flex items-center   justify-between">
          <div className="pt-1 text-3xl text-brightRed font-bold">
            <h2>Tailwind</h2>
          </div>
          <div className="hidden  md:flex space-x-8">
            <Link className=" hover:text-red-500">Home</Link>
            <Link className=" hover:text-red-500">About</Link>
            <Link className=" hover:text-red-500">Contact</Link>
          </div>
          <a
            href="#"
            className="hidden md:block px-6 py-2 text-white bg-brightRed rounded-full hover:bg-brightRedLight "
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="hero">
        <div className="hero-container flex flex-col items-center px-6 mx-auto mt-10 space-y-0 md:space-y-0 md:flex-row">
          {/* LEFT ITEM */}
          <div className="flex flex-col mb-32 space-y-12 md:w-1/2">
            <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl md:text-left">
              Bring everyone together to build better products
            </h1>
            <p className="max-w-sm text-center ml-8 text-darkGrayishBlue md:text-left">
              Manage makes it simple for software teams to plan day-to-day tasks
              while keeping the larger team goals in view.
            </p>
            <div className="flex ml-40 justify-center md:justify-start">
              <a
                href="#"
                className="hidden md:block px-6 py-2 text-white bg-brightRed rounded-full hover:bg-brightRedLight "
              >
                Get Started
              </a>
            </div>
          </div>
          <div className="xl:w-1/2 ">
            <img src={illustration} alt="Illustration" />
          </div>
        </div>
      </section>
      {/* FEATURES SECTION */}
      <section id="features">
        {/* flex container */}
        <div className="feature-container flex flex-col px-4 mx-auto mt-10 space-y-12 md:space-y-0 md:flex-row">
          {/* what's different */}
          <div className="flex flex-col space-y-12 md:w-1/2">
            <h2 className="max-w-md font-bold text-center text-3xl md:text-4xl md:text-left">
              What's different about Manage?
            </h2>
            <p className="max-w-sm text-center ml-8 text-darkGrayishBlue md:text-left">
              Manage provides all the functionality your team needs, without the
              complexity. Our software is tailor made for modern digital product
              teams.
            </p>
          </div>
          {/* numbered list */}
          <div className="flex flex-col space-y-8 md:w-1/2">
            {/* LIST ITEM 1 */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row">
              {/* heading */}
              <div className="rounded-l-full bg-brightRedSupLight md:bg-transparent">
                <div className="flex items-center space-x-2">
                  <div className="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed">
                    01
                  </div>
                  <h3 className="text-base font-bold md:mb-4 md:hidden">
                    Track company-wide progress
                  </h3>
                </div>
              </div>
              <div>
                <h3 className="hidden mb-4 text-lg font-bold md:block">
                  Track company-wide progress
                </h3>
                <p className="text-darkGrayishBlue">
                  See how your day-to-day tasks fit into the wider vision.Go
                  from tracking progress at the milestone level all the way done
                  to the smallest of details. Never lose sight of the bigger
                  picture again.
                </p>
              </div>
            </div>
            {/* LIST ITEM 1 */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row">
              {/* heading */}
              <div className="rounded-l-full bg-brightRedSupLight md:bg-transparent">
                <div className="flex items-center space-x-2">
                  <div className="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed">
                    02
                  </div>
                  <h3 className="text-base font-bold md:mb-4 md:hidden">
                    Track company-wide progress
                  </h3>
                </div>
              </div>
              <div>
                <h3 className="hidden mb-4 text-lg font-bold md:block">
                  Track company-wide progress
                </h3>
                <p className="text-darkGrayishBlue">
                  See how your day-to-day tasks fit into the wider vision.Go
                  from tracking progress at the milestone level all the way done
                  to the smallest of details. Never lose sight of the bigger
                  picture again.
                </p>
              </div>
            </div>
            {/* LIST ITEM 1 */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row">
              {/* heading */}
              <div className="rounded-l-full bg-brightRedSupLight md:bg-transparent">
                <div className="flex items-center space-x-2">
                  <div className="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed">
                    03
                  </div>
                  <h3 className="text-base font-bold md:mb-4 md:hidden">
                    Track company-wide progress
                  </h3>
                </div>
              </div>
              <div>
                <h3 className="hidden mb-4 text-lg font-bold md:block">
                  Track company-wide progress
                </h3>
                <p className="text-darkGrayishBlue">
                  See how your day-to-day tasks fit into the wider vision.Go
                  from tracking progress at the milestone level all the way done
                  to the smallest of details. Never lose sight of the bigger
                  picture again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="testimonials">
        {/* Container to heading and testimonials */}
        <div className="max-w-6xl px-5 mx-auto mt-32 text-center">
          {/* HEADING */}
          <h2 className="text-4xl font-bold text-center">
            What's different about manage?
          </h2>
          {/* Testimonials container */}
          <div className="flex flex-col mt-24 md:flex-row md:space-x-6">
            {/* Testimonial 1 */}

            <div className="flex flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3 ms:mt-10">
              <img src="" className="w-16 -mt-14" alt="" />
              <h5 className="text-lg font-bold mt-1">Anisha Li</h5>
              <p className="text-sm text-darkGrayishBlue ">
                "Manage has supercharged out team's workflow. The ability to
                maintain visibility on larger milestones at all times keeps
                everyone motivated."
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3 ms: mt-10">
              <img src="" className="w-16 -mt-14" alt="" />
              <h5 className="text-lg font-bold mt-1">Anisha Li</h5>
              <p className="text-sm text-darkGrayishBlue ">
                "Manage has supercharged out team's workflow. The ability to
                maintain visibility on larger milestones at all times keeps
                everyone motivated."
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3 ms: mt-10">
              <img src="" className="w-16 -mt-14" alt="" />
              <h5 className="text-lg font-bold mt-1">Anisha Li</h5>
              <p className="text-sm text-darkGrayishBlue ">
                "Manage has supercharged out team's workflow. The ability to
                maintain visibility on larger milestones at all times keeps
                everyone motivated."
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* cta section */}
      <section id="cta" class="bg-brightRed">
        {/* flex-container */}
        <div class="cta-container flex flex-col items-center justify-between px-6 py-24 mx-auto space-y-12 md:py-12 md:flex-row md:space-y-0">
          {/* heading */}
          <h2 class="text-5xl font-bold leading-tight text-center text-white md:text-4xl md:max-w-xl md:text-left">
            Simplify how your team works today
          </h2>
          {/* button */}
          <div>
            <a
              href="#"
              class="p-3 px-6 pt-3 text-brightRed bg-white rounded-full shadow-2xl baseline hover:bg-gray-900"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer class="bg-veryDarkBlue">
{/*        <!-- Flex Container -->
 */}       <div
         class="container flex flex-col-reverse justify-between px-6 py-10 mx-auto space-y-8 md:flex-row md:space-y-0"
       >
{/*          <!-- Logo and social links container -->
 */}         <div
           class="flex flex-col-reverse items-center justify-between space-y-12 md:flex-col md:space-y-0 md:items-start"
         >
           <div class="mx-auto my-6 text-center text-white md:hidden">
             Copyright &copy; 2022, All Rights Reserved
           </div>
{/*            <!-- Logo -->
 */}           <div>
             <img src="img/logo-white.svg" class="h-8" alt="" />
           </div>
{/*            <!-- Social Links Container -->
 */}           <div class="flex justify-center space-x-4">
{/*              <!-- Link 1 -->
 */}             <a href="#">
               <img src="img/icon-facebook.svg" alt="" class="h-8" />
             </a>
{/*              <!-- Link 2 -->
 */}             <a href="#">
               <img src="img/icon-youtube.svg" alt="" class="h-8" />
             </a>
{/*              <!-- Link 3 -->
 */}             <a href="#">
               <img src="img/icon-twitter.svg" alt="" class="h-8" />
             </a>
{/*              <!-- Link 4 -->
 */}             <a href="#">
               <img src="img/icon-pinterest.svg" alt="" class="h-8" />
             </a>
{/*              <!-- Link 5 -->
 */}             <a href="#">
               <img src="img/icon-instagram.svg" alt="" class="h-8" />
             </a>
           </div>
         </div>
{/*          <!-- List Container -->
 */}         <div class="flex justify-around space-x-32">
           <div class="flex flex-col space-y-3 text-white">
             <a href="#" class="hover:text-brightRed">Home</a>
             <a href="#" class="hover:text-brightRed">Pricing</a>
             <a href="#" class="hover:text-brightRed">Products</a>
             <a href="#" class="hover:text-brightRed">About</a>
           </div>
           <div class="flex flex-col space-y-3 text-white">
             <a href="#" class="hover:text-brightRed">Careers</a>
             <a href="#" class="hover:text-brightRed">Community</a>
             <a href="#" class="hover:text-brightRed">Privacy Policy</a>
           </div>
         </div>
 
{/*          <!-- Input Container -->
 */}         <div class="flex flex-col justify-between">
           <form>
             <div class="flex space-x-3">
               <input
                 type="text"
                 class="flex-1 px-4 rounded-full focus:outline-none"
                 placeholder="Updated in your inbox"
               />
               <button
                 class="px-6 py-2 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none"
               >
                 Go
               </button>
             </div>
           </form>
           <div class="hidden text-white md:block">
             Copyright &copy; 2022, All Rights Reserved
           </div>
         </div>
       </div>
     </footer>
    </div>
  );
};
