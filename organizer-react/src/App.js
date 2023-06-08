import "./App.css"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CheckSigned from "./components/Signing/CheckSigned";
import EntrancePage from "./components/Signing/EntrancePage";
import CalendarPage from "./components/Calendar";
import Navigation from "./components/Navigation";
import TaskManager from "./components/TaskManager";
import Home from "./components/Home";
import Signing from "./components/Signing";
import LogOut from "./components/Signing/LogOut";

function App() {
	return (
		<BrowserRouter>
			<Signing>
				<Routes>
					<Route path='/' element={
						<>
							<Navigation/>
							<Home/>
						</>
					}/>
					<Route path='/calendar' element={
						<CheckSigned>
							<Navigation/>
							<CalendarPage/>
						</CheckSigned>
					}/>
					<Route path='/signing' element={
						<>
							<Navigation/>
							<EntrancePage/>
						</>
					}/>
					<Route path='/logout' element={<LogOut/>}/>
					<Route path='/todo' element={
						<CheckSigned>
							<Navigation/>
							<TaskManager/>
						</CheckSigned>
					}/>
				</Routes>
			</Signing>
		</BrowserRouter>
	);
}

export default App;
