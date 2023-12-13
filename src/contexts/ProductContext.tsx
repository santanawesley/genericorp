import React, {
	ReactNode,
	createContext,
	useCallback,
	useEffect,
	useState,
} from 'react';
import verbs, { adjectives } from '../names_mock';

export type ProductData = {
	name: string;
	imageUrl: string;
	description: string;
	value: number;
	favorite: boolean;
	quantityInStock: number;
	hasBuyIntention: boolean;
	quantityBuyIntention: number;
	sku: string;
};

type ProductContextType = {
	cardsData: ProductData[];
	isFavoriteFilterActive: boolean;
	toggleBuyIntention: (productId: string) => void;
	toggleFavorite: (productId: string) => void;
	toggleFilterFavorite: (status: boolean) => void;
	setQuantityBuyIntention: (productId: string, quantity: number) => void;
};

interface MyComponentProps {
	children: ReactNode;
}

export const ProductContext = createContext<ProductContextType>({
	cardsData: [],
	isFavoriteFilterActive: false,
	toggleBuyIntention: () => {},
	toggleFavorite: () => {},
	toggleFilterFavorite: () => {},
	setQuantityBuyIntention: () => {},
});

const ProductsProvider: React.FC<MyComponentProps> = ({ children }) => {
	const [names, setNames] = useState<string[]>([]);
	const [descriptions, setDescriptions] = useState<string[]>([]);
	const [imagesUrl, setImagesUrl] = useState<string[]>([]);
	const [ids, setIds] = useState<string[]>([]);
	const [quantityInStock, setQuantityInStock] = useState<number[]>([]);
	const [cardsData, setCardsData] = useState<ProductData[]>([]);
	const [isFavoriteFilterActive, setIsFavoriteFilterActive] = useState(false);

	useEffect(() => {
		mountCardsData();
	}, [names, descriptions, imagesUrl]);

	useEffect(() => {
		createNames();
		createDescriptions();
		createId();
		fetchRandomImages();
		mountQuantityInStock();
	}, []);

	const createNames = () => {
		const mountedNames: string[] = [];
		const usedVerbs: Record<string, boolean> = {};
		const usedAdjectives: Record<string, boolean> = {};

		verbs.forEach(verb => {
			adjectives.forEach(adjective => {
				if (!usedVerbs[verb] && !usedAdjectives[adjective]) {
					const nome = `${verb} ${adjective}`;
					mountedNames.push(nome);
					usedVerbs[verb] = true;
					usedAdjectives[adjective] = true;
				}
			});
		});

		setNames(mountedNames);
	};

	const createDescriptions = () => {
		const words: string[] = [
			'produto',
			'farmácia',
			'saúde',
			'remédio',
			'vitamina',
			'alergia',
			'analgésico',
			'anti-inflamatório',
			'antibiótico',
			'creme',
			'pomada',
			'suplemento',
			'imunidade',
			'bem-estar',
			'doença',
			'tratamento',
			'receita',
		];

		const generateRandomDescription = () => {
			let descriptionLength = 0;
			let description = '';

			while (descriptionLength < 20 || descriptionLength > 500) {
				description = '';
				descriptionLength = 0;

				while (descriptionLength < 500) {
					const randomIndex = Math.floor(Math.random() * words.length);
					const word = words[randomIndex];

					if (descriptionLength + word.length <= 500) {
						description += `${word} `;
						descriptionLength += word.length + 1;
					} else {
						break;
					}
				}
			}

			return description.trim();
		};

		const descriptions: string[] = [];
		for (let i = 0; i < 50; i++) {
			const description = generateRandomDescription();
			descriptions.push(description);
		}

		setDescriptions(descriptions);
	};

	function createId() {
		const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		const words: Set<string> = new Set();

		while (words.size < 50) {
			let word = '';
			for (let i = 0; i < 5; i++) {
				const randomIndex = Math.floor(Math.random() * characters.length);
				word += characters[randomIndex];
			}
			words.add(word);
		}
		setIds(Array.from(words));
	}

	const getImages = async (wordsArray: string[]) => {
		const images = [];

		for (const word of wordsArray) {
			try {
				const response = await fetch(
					`https://picsum.photos/seed/${word}/200/300`,
				);
				const imageUrl = response.url;
				images.push(imageUrl);
			} catch (error) {
				console.error(`Erro ao buscar imagem para ${word}: ${error}`);
				images.push('');
			}
		}
		return images;
	};

	const fetchRandomImages = useCallback(async () => {
		const words = [
			'banana',
			'uva',
			'maça',
			'pera',
			'laranja',
			'abacaxi',
			'morango',
			'melancia',
			'limão',
			'abacate',
			'melão',
			'mamão',
			'kiwi',
			'pêssego',
			'ameixa',
			'caqui',
			'cereja',
			'framboesa',
			'mirtilo',
			'goiaba',
			'manga',
			'maracujá',
			'figo',
			'nectarina',
			'tangerina',
			'jabuticaba',
			'caju',
			'pitanga',
			'abacaxi',
			'piqui',
			'abóbora',
			'cenoura',
			'beterraba',
			'batata',
			'tomate',
			'cebola',
			'alho',
			'pimentão',
			'pepino',
			'berinjela',
			'abobrinha',
			'couve-flor',
			'brócolis',
			'espinafre',
			'rúcula',
			'alface',
			'repolho',
			'salsão',
			'coentro',
			'cebolinha',
		];

		const promises = [];
		let startIndex = 0;
		const totalImages = 50;

		while (startIndex <= totalImages) {
			let endIndex = Math.min(startIndex + 10, totalImages);
			promises.push(getImages(words.slice(startIndex, endIndex)));
			startIndex += 10;
		}

		const imagesData = await Promise.all(promises);
		const images = imagesData.flat();

		setImagesUrl(images);
	}, []);

	const calculateName = (name: string) => {
		const separateWords = name.split(' ');
		return separateWords.length;
	};

	const mountCardsData = () => {
		const CardsStructure = names.map((name, idx) => {
			return {
				name,
				imageUrl: imagesUrl[idx],
				description: descriptions[idx],
				value: mountValue(calculateName(name), descriptions[idx]?.length),
				favorite: false,
				quantityInStock: quantityInStock[idx],
				hasBuyIntention: false,
				quantityBuyIntention: 0,
				sku: ids[idx],
			};
		});
		setCardsData(CardsStructure);
	};

	const mountValue = (nameLength: number, descrLength: number) => {
		const value = 10 + nameLength * ((500 - descrLength) / (4 - nameLength));
		return value;
	};

	const mountQuantityInStock = () => {
		const Numbers: number[] = [];
		for (let i = 0; i < 50; i++) {
			const randomNumber = Math.floor(Math.random() * 10) + 1;
			Numbers.push(randomNumber);
		}
		setQuantityInStock(Numbers);
	};

	const toggleFavorite = (skuToBeChanged: string) => {
		setCardsData(prevProducts => {
			const updatedProducts = prevProducts.map(product => {
				if (product.sku === skuToBeChanged) {
					return {
						...product,
						favorite: !product.favorite,
					};
				}
				return product;
			});
			return updatedProducts;
		});
	};

	const toggleBuyIntention = (skuToBeChanged: string) => {
		setCardsData(prevProducts => {
			const updatedProducts = prevProducts.map(product => {
				if (product.sku === skuToBeChanged) {
					return {
						...product,
						hasBuyIntention: !product.hasBuyIntention,
					};
				}
				return product;
			});
			return updatedProducts;
		});
	};

	const setQuantityBuyIntention = (
		skuToBeChanged: string,
		quantity: number,
	) => {
		setCardsData(prevProducts => {
			const updatedProducts = prevProducts.map(product => {
				if (product.sku === skuToBeChanged) {
					return {
						...product,
						quantityBuyIntention: quantity,
					};
				}
				return product;
			});
			return updatedProducts;
		});
	};

	const toggleFilterFavorite = (status: boolean) => {
		setIsFavoriteFilterActive(status);
	};

	const contextValue: ProductContextType = {
		cardsData,
		isFavoriteFilterActive,
		setQuantityBuyIntention,
		toggleBuyIntention,
		toggleFavorite,
		toggleFilterFavorite,
	};

	return (
		<ProductContext.Provider value={contextValue}>
			{children}
		</ProductContext.Provider>
	);
};

export default ProductsProvider;
