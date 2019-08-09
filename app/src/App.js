import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View, Search, Gallery } from '@vkontakte/vkui';
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

	onChange(search) {

		this.setState({ 
			search : search,
			games : [] 
		}, function() {
			fetch(`https://api.rawg.io/api/games/${this.state.search.replace(/ /g, "-")}/suggested?page_size=5`)
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

	render() {
		return (
			<View activePanel="home">
				<div id="home">
					<div>
						<h1
							style={{
								paddingLeft : 16,
								fontSize : 36,
								padingTop : 20
							}}
						>Найди похожую игру <span role="img">🎮</span></h1>
						<Search 
							value={this.state.search}
							onChange={this.onChange}
						/>
						{
							this.state.games.length > 0 &&
							this.state.games.map((game, index) => (
								<div key={index} style={{
									padding : 16
								}}>
									<h2>{game.name}</h2>
									<h3>
										{ game.genres.map((gen, index) => (
											<span key={index}>{gen.name}</span>
										))}
									</h3>
									<p>{game.short_description}</p>
									<Gallery
										slideWidth="90%"
										style={{ height: 270 }}
									>
										{
											game.short_screenshots.map((screen, index) => (
												<img
													alt=""
													src={screen.image}
													key={index}
													style={{
														marginRight : 5
													}}
												></img>
											))
										}
									</Gallery>
								</div>
							))
						}
					</div>
				</div>
			</View>
		);
	}
}

export default App;
