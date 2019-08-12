import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View, Search, Gallery, Button, Group, InfoRow, Panel, FixedLayout, PanelHeader, Div, Cell, List } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			search : '',
			games : []
		};

		this.onChange = this.onChange.bind(this)
	}

	Translitirate(word) {
		if (word != undefined) {
			var A = {};
			var result = '';
	
			A["Ё"] = "YO"; A["Й"] = "I"; A["Ц"] = "TS"; A["У"] = "U"; A["К"] = "K"; A["Е"] = "E"; A["Н"] = "N"; A["Г"] = "G"; A["Ш"] = "SH"; A["Щ"] = "SCH"; A["З"] = "Z"; A["Х"] = "H"; A["Ъ"] = "'";
			A["ё"] = "yo"; A["й"] = "i"; A["ц"] = "ts"; A["у"] = "u"; A["к"] = "k"; A["е"] = "e"; A["н"] = "n"; A["г"] = "g"; A["ш"] = "sh"; A["щ"] = "sch"; A["з"] = "z"; A["х"] = "h"; A["ъ"] = "'";
			A["Ф"] = "F"; A["Ы"] = "I"; A["В"] = "V"; A["А"] = "A"; A["П"] = "P"; A["Р"] = "R"; A["О"] = "O"; A["Л"] = "L"; A["Д"] = "D"; A["Ж"] = "ZH"; A["Э"] = "E";
			A["ф"] = "f"; A["ы"] = "i"; A["в"] = "v"; A["а"] = "a"; A["п"] = "p"; A["р"] = "r"; A["о"] = "o"; A["л"] = "l"; A["д"] = "d"; A["ж"] = "zh"; A["э"] = "e";
			A["Я"] = "YA"; A["Ч"] = "CH"; A["С"] = "S"; A["М"] = "M"; A["И"] = "I"; A["Т"] = "T"; A["Ь"] = "'"; A["Б"] = "B"; A["Ю"] = "YU";
			A["я"] = "ya"; A["ч"] = "ch"; A["с"] = "s"; A["м"] = "m"; A["и"] = "i"; A["т"] = "t"; A["ь"] = "'"; A["б"] = "b"; A["ю"] = "yu";
	
			for (var i = 0; i < word.length; i++) {
				var c = word.charAt(i);
	
				result += A[c] || c;
			}
		
			return result.replace(/[\W_]+/g, " ");
		} else {
			return ""
		}
	}

	onGetResult(search){ 
		this.setState({ 
			games : [] 
		}, function() {
			fetch(`https://api.rawg.io/api/games/${search}/suggested?page_size=5`)
			.then(res => res.json())
			.then(data => {
				if (typeof data.results !== 'undefined') {
					this.setState({
						games : data.results
					})
				}
			})
		});
	}

	onChange(search) {

		this.setState({ 
			search : search,
		}, function() {
			fetch(`https://api.rawg.io/api/games?page_size=5&search=${this.Translitirate(search)}`)
			.then(res => res.json())
			.then(data => {
				if (typeof data.results !== 'undefined') {
					if (data.results[0] != null) {
						this.onGetResult(data.results[0].slug)
					}
				}
			})
		});
	}

	getYear(gameDate) {
		return new Date(gameDate).getFullYear();
	}

	isMetacriticAvailable(score) {
		if (score != undefined) {
			return score;
		} else {
			return "Неизвестно"
		}
	}

	openShowImages(images) {
		connect.send("VKWebAppShowImages", { 
			images:  images
		  });
	}


	render() {
		return (
			<View activePanel="main">
				<Panel id="main" theme="white">
				<PanelHeader>
						<b>Найди похожую игру</b> <span role="img">🎮</span>
				</PanelHeader>
					<div>
					<FixedLayout vertical="top" style={{ background: 'white' }}>
					<Search
							value={this.state.search}
							onChange={this.onChange}
							/>
						</FixedLayout>
						<Div style={{
							paddingTop: 40
						}}>
						{
							
							this.state.games.length > 0 &&
							this.state.games.map((game, index) => (
								<div key={index} style={{
									padding : 16
								}}>
									<h2>{game.name}</h2>
									<Group 
										title="Информация об игре"
										style={{
											marginBottom : 16
										}}
									>
										<List>
											<Cell>
												<InfoRow title="Жанр">
												{	this.state.games.length > 0 &&
													game.genres.map((gen, index) => (
														<span key={index}>{gen.name} </span>
													))
												}
												</InfoRow>
											</Cell>
											<Cell>
												<InfoRow title="Дата выхода">
													{this.getYear(game.released)}
												</InfoRow>
											</Cell>
											<Cell>
												<InfoRow title="Metacritic">
													{this.isMetacriticAvailable(game.metacritic)}
												</InfoRow>
											</Cell>
											<Div>
												<InfoRow title="Краткое описание" />
													{game.short_description}
											</Div>
											<Div>
												<InfoRow title="Где купить" />
												{
													game.stores.map((store, index) => (
														<Button style={{
															margin: 5
															}} 
															level="commerce"
															key={index}
															component="a" 
															href={store.url_en}>
															{store.store.name}
														</Button>
													))
												}
											</Div>
											<Cell>
												<InfoRow title="Галерея" />
												<Gallery
													slideWidth="90%"
													style={{ height: 'inherit' }}
												>
												{
													game.short_screenshots.map((screen, index) => (
														<img
															alt=""
															src={screen.image}
															key={index}
															style={{
																minWidth : 320
															}}
															onClick={(e) => {
																	let images = game.short_screenshots.map((scr) => scr.image)
																	this.openShowImages(images)
																}
															}
														></img>
													))
												}
												</Gallery>
											</Cell>
										</List>
									</Group>
								</div>
							))
							}
							</Div>
					</div>
    			</Panel>
			</View>
		);
	}
}

export default App;
