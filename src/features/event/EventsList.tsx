import EventItem from '../../components/ui/EventItem.tsx';
import Input from '../../components/ui/Input.tsx';
import { useEventContext } from '../../context/EventContext.tsx';
import { useUserContext } from '../../context/UserContext.tsx';
import EventSearch from './EventSearch.tsx';


export default function EventsListPage() {
  const eventCtx = useEventContext();
  const userCtx = useUserContext();

  // useEffect(() => {
  //   const aaa = async () => {
  //     console.log("register")
  //     const accessToken = await UserApi.register({ email: "test2@test.pl", password: "1234", eventsIds: [], role: 'Admin' })
  //     console.log(`accessToken: ${accessToken}`)
  //   }
  //   aaa()
  //   console.log("ddd")
  // }, [])





  return (
    <main >
      <header className='mb-4 '>
        <h2 className='text-2xl mx-auto w-min text-nowrap'>Available Events</h2>
        <p>
          Many aviable events for you. Look and choose the best.
        </p>
      </header>
      <EventSearch/>
      

      <div id='content'>
        {eventCtx.status === "pending" && <div role="status" aria-label='loading'>Loading...</div>}
        {eventCtx.status === "error" && <div role="alert">{eventCtx.errorMessage}</div>}
        {eventCtx.events &&
          <div className='grid grid-cols-2 gap-2'>

            {eventCtx.events.map(s => {
              return <EventItem mode='public' event={s}></EventItem>
            })
            }

          </div>
        }
        {eventCtx.events && eventCtx.events.length == 0 &&
          <div >
            <h2 className='text-xl mx-auto w-min text-nowrap'>No events found.</h2>
           

          </div>
        }
      </div>
    </main>
  );
}
