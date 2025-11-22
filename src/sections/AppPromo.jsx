import Container from "../components/ui/Container.jsx";

export default function AppPromo() {
  return (
    <section className="py-12 bg-teal-700 text-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-around">
          <img src="src/assets/All-Banner 1.png" alt="" />
        </div>
          <div>
            <h3 className="text-2xl font-extrabold">Your travel buddy is comming soon!</h3>
            <p className="mt-2 text-teal-100">You can download TravelHug directly from the stores.</p>
            <div className="mt-4 flex items-center gap-3">
              <a className="px-4 py-2 rounded-xl bg-black text-white inline-flex items-center gap-2" href="#">
                <img className="w-[30px]" src="src/assets/google-play.png" />
                <div>
                  <p className="text-[12px]">GET IN ON</p>
                  <p className="text-xl">Google Play</p>
                </div>
              </a>
              <a className="px-4 py-2 rounded-xl bg-black text-white inline-flex items-center gap-2" href="#">
                <img className="w-[30px]" src="src/assets/apple.png" />
                <div>
                  <p className="text-[12px]">Download on the</p>
                  <p className="text-xl">Apple Store</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
