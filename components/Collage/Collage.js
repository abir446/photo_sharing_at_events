import React from 'react'

export default function Collage() {
  return (
    <div className="lg:col-span-7 relative flex items-center justify-center w-full min-h-[300px] sm:min-h-[460px] md:min-h-[540px] max-w-2xl lg:ml-auto z-10 select-none mt-8 lg:mt-0">
      
      {/* Floating Paper Airplane */}
      <div className="animate-float-fast absolute top-0 left-[18%] text-indigo-500/80 pointer-events-none hidden sm:block">
        <svg className="w-10 h-10 transform rotate-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </div>

      {/* Floating Camera Badge */}
      <div className="absolute top-[38%] left-0 sm:left-2 bg-white rounded-2xl p-2 sm:p-3.5 shadow-xl shadow-slate-900/5 border border-indigo-50/50 text-indigo-500 animate-float-slow opacity-95 hover:scale-110 hover:shadow-indigo-100 hover:rotate-6 transition-all duration-300 z-10 cursor-pointer">
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.502 4h-5c-.714 0-1.378.366-1.764.996l-.823 1.316Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </div>

      {/* Floating Image Badge */}
      <div className="absolute bottom-[8%] left-[30%] sm:left-[36%] bg-white rounded-2xl p-2 sm:p-3.5 shadow-xl shadow-slate-900/5 border border-indigo-50/50 text-indigo-500 animate-float-delayed opacity-95 hover:scale-110 hover:shadow-indigo-100 hover:rotate-[6deg] transition-all duration-300 z-10 cursor-pointer">
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </div>

      {/* Floating Cloud Upload Badge */}
      <div className="absolute bottom-[35%] right-0 sm:right-4 bg-white rounded-2xl p-2 sm:p-3.5 shadow-xl shadow-slate-900/5 border border-indigo-50/50 text-indigo-500 animate-float-slow opacity-95 hover:scale-110 hover:shadow-indigo-100 hover:rotate-12 transition-all duration-300 z-10 cursor-pointer">
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>
      </div>

      {/* Collage Images */}
      <div className="relative w-full h-[260px] sm:h-[350px] md:h-[400px]">
        
        {/* Concert Card */}
        <div className="absolute top-0 left-[50%] -translate-x-[75%] w-[130px] sm:w-[170px] md:w-[220px] aspect-[4/3] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100/50 rotate-[-7deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://plus.unsplash.com/premium_photo-1663076211121-36754a46de8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Event photo sharing" 
          />
        </div>

        {/* Friends Applause Card */}
        <div className="absolute top-2 sm:top-4 left-[50%] translate-x-[25%] sm:translate-x-[40%] w-[110px] sm:w-[140px] md:w-[180px] aspect-[4/5] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100/50 rotate-[6deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://i.pinimg.com/originals/0a/4d/8e/0a4d8edb28b8c40bf103a6f282244e7b.jpg" 
            alt="Decoration of Baby Ceremony" 
          />
        </div>

        {/* Mountain Group Card */}
        <div className="absolute top-16 sm:top-28 left-[50%] -translate-x-[95%] w-[150px] sm:w-[200px] md:w-[260px] aspect-[3/2] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100/50 rotate-[4deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://mmnews.tv/wp-content/uploads/2022/12/Leo-1.jpg" 
            alt="Lionel Messi World Cup" 
          />
        </div>

        {/* Cameracloseup Card */}
        <div className="absolute top-28 sm:top-44 left-[50%] translate-x-[20%] sm:translate-x-[35%] w-[115px] sm:w-[150px] md:w-[190px] aspect-[1/1] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100/50 rotate-[-5deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Engagement" 
          />
        </div>

        {/* Sunset Silhouettes Card */}
        <div className="absolute top-[150px] sm:top-[230px] left-[50%] -translate-x-[45%] w-[120px] sm:w-[160px] md:w-[210px] aspect-[4/3] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100/50 rotate-[-3deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Pyar Ka Bandhan" 
          />
        </div>

        {/* Virat/Anuska Card */}
        <div className="absolute top-[160px] sm:top-[245px] left-[50%] translate-x-[40%] sm:translate-x-[50%] w-[115px] sm:w-[150px] md:w-[195px] aspect-[4/3] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100/50 rotate-[7deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://assets.vogue.in/photos/5de0d434a650480008c24145/2:3/w_2560,c_limit/Anushka%20Sharma%20Virat%20Kohli%20Wedding%20Pictures%20Tuscany%20Italy.jpg" 
            alt="Virat and Anuska's Wedding Ceremony" 
          />
        </div>

      </div>

    </div>
  )
}
