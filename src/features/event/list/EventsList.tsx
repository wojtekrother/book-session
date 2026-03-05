import EventItem from '../../../components/ui/EventItem.tsx';
import SkeletonList from './skeleton/SkeletonEventList.tsx';
import { EventDTO } from '../../../types/types.ts';

export type EventsListParams = {
  events: EventDTO[],
  skeleton?: boolean
}

export default function EventsList({ events, skeleton = false }: EventsListParams) {

 

  return (
    <>

<div className='grid grid-cols-2 gap-2'>
      {(events.length > 0 && !skeleton)  &&
          events.map(s => {
            return <EventItem mode='public' event={s}></EventItem>
          })
      }
        
        
      
      {skeleton &&
          <SkeletonList itemsCount={5}/>
        }
      </div>
      {events.length == 0 &&
        <div >
          <h2 className='text-xl mx-auto w-min text-nowrap'>No events found.</h2>
        </div>
      }
    </>
  )
}
