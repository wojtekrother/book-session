import EventItem from '../../components/ui/EventItem.tsx';
import { useEventContext } from '../../context/EventContext.tsx';
import { useUserContext } from '../../context/UserContext.tsx';


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
      <header>
        <h2>Available mentoring events</h2>
        <p>
          From an one-on-one introduction to React's basics all the way up to a
          deep dive into state mechanics - we got just the right event for
          you!
        </p>
      </header>

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
      </div>
    </main>
  );
}
