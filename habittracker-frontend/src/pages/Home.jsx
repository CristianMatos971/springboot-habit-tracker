import Header from "../components/Header";

function Home() {
    return (
        <>
            <Header />

            <div className="px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-800">
                    Welcome!
                </h2>

                <p className="mt-4 text-gray-600 max-w-xl">
                    Organize tasks, track habits, follow Pomodoro focus sessions and more.
                </p>
            </div>
        </>
    );
}

export default Home;
