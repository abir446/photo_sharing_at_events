import React from 'react'

export default function Collage() {
  return (
    <div className="lg:col-span-7 relative flex items-center justify-center w-full min-h-[300px] sm:min-h-[460px] md:min-h-[540px] max-w-2xl lg:ml-auto z-10 select-none mt-8 lg:mt-0">
      
      {/* Collage Images */}
      <div className="relative w-full h-[260px] sm:h-[350px] md:h-[400px]">
        
        {/* Concert Card */}
        <div className="absolute top-0 left-[50%] -translate-x-[75%] w-[130px] sm:w-[170px] md:w-[220px] aspect-[4/3] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-2xl shadow-ink-950/50 border border-white/10 rotate-[-7deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://plus.unsplash.com/premium_photo-1663076211121-36754a46de8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Event photo sharing" 
          />
        </div>

        {/* Friends Applause Card */}
        <div className="absolute top-2 sm:top-4 left-[50%] translate-x-[25%] sm:translate-x-[40%] w-[110px] sm:w-[140px] md:w-[180px] aspect-[4/5] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-2xl shadow-ink-950/50 border border-white/10 rotate-[6deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://i.pinimg.com/originals/0a/4d/8e/0a4d8edb28b8c40bf103a6f282244e7b.jpg" 
            alt="Decoration of Baby Ceremony" 
          />
        </div>

        {/* Mountain Group Card */}
        <div className="absolute top-16 sm:top-28 left-[50%] -translate-x-[95%] w-[150px] sm:w-[200px] md:w-[260px] aspect-[3/2] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-2xl shadow-ink-950/50 border border-white/10 rotate-[4deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://mmnews.tv/wp-content/uploads/2022/12/Leo-1.jpg" 
            alt="Lionel Messi World Cup" 
          />
        </div>

        {/* Engagement Card */}
        <div className="absolute top-28 sm:top-44 left-[50%] translate-x-[20%] sm:translate-x-[35%] w-[115px] sm:w-[150px] md:w-[190px] aspect-[1/1] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-2xl shadow-ink-950/50 border border-white/10 rotate-[-5deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Engagement" 
          />
        </div>

        {/* Sunset Silhouettes Card */}
        <div className="absolute top-[150px] sm:top-[230px] left-[50%] -translate-x-[45%] w-[120px] sm:w-[160px] md:w-[210px] aspect-[4/3] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-2xl shadow-ink-950/50 border border-white/10 rotate-[-3deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-lg sm:rounded-xl pointer-events-none"
            src="https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Pyar Ka Bandhan" 
          />
        </div>

        {/* Virat/Anuska Card */}
        <div className="absolute top-[160px] sm:top-[245px] left-[50%] translate-x-[40%] sm:translate-x-[50%] w-[115px] sm:w-[150px] md:w-[195px] aspect-[4/3] bg-white p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-2xl shadow-ink-950/50 border border-white/10 rotate-[7deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer overflow-hidden">
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
