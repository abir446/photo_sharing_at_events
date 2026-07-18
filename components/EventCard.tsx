
const EventCard = ({eName, eDate, eId}: {eName: string, eDate: string, eId: string}) => {
  return (
    <div>
        <div className={`rounded-xl bg-white p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow ${eName}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{eName}</h3>
                <p className="text-sm text-gray-600">Date: {eDate}</p>
              </div>
              <div className="text-sm text-indigo-600 font-medium">View QR Codes →</div>
            </div>
          </div>
    </div>
  )
}

export default EventCard