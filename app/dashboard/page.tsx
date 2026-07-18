import EventCard from '@/components/EventCard'

const page = () => {
  return (
    <div className='p-4 space-y-4'>
        <EventCard eName='P&R Engagement' eDate='03-03-2025' eId='1' />
        <EventCard eName='A&N Sangeet' eDate='11-04-2025' eId='2' />
        <EventCard eName='A&N Reception' eDate='12-04-2025' eId='3' />
    </div>
  )
}

export default page