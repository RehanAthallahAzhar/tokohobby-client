import ActionFigureImage from '../assets/action-figure.png';
import ActionFigureBanner from '../assets/action-figure-2.png';
import RunImage from '../assets/logo-run.png';
import GameImage from '../assets/logo-game.png';
import FashionImage from '../assets/logo-fashion.png';
import { HiOutlineShoppingBag, HiOutlinePuzzlePiece, HiOutlinePaintBrush, HiOutlineMusicalNote, HiOutlineCamera, HiOutlineBookOpen } from 'react-icons/hi2';


export const categories = [
    {
        name: 'Action Figure',
        slug: 'action-figure',
        type: 'image',
        value: ActionFigureImage,
        heroImage: ActionFigureBanner,
        description: 'Koleksi action figure dari berbagai franchise favorit Anda'
    },
    {
        name: 'Sport',
        slug: 'sport',
        type: 'image',
        value: RunImage,
        heroImage: RunImage,
        description: 'Perlengkapan olahraga untuk berbagai aktivitas fisik'
    },
    {
        name: 'Games & Puzzles',
        slug: 'games-puzzles',
        type: 'image',
        value: GameImage,
        heroImage: GameImage,
        description: 'Board games, puzzle, dan permainan edukatif'
    },
    {
        name: 'Clothes & Footwear',
        slug: 'clothes-footwear',
        type: 'image',
        value: FashionImage,
        heroImage: FashionImage,
        description: 'Fashion dan alas kaki untuk hobi Anda'
    },
    {
        name: 'Model Kits',
        slug: 'model-kits',
        type: 'icon',
        value: HiOutlinePuzzlePiece,
        heroImage: 'https://placehold.co/600x400/6366f1/ffffff?text=Model+Kits',
        description: 'Gundam, mobil, pesawat, dan model kit lainnya'
    },
    {
        name: 'Art & Craft',
        slug: 'art-craft',
        type: 'icon',
        value: HiOutlinePaintBrush,
        heroImage: 'https://placehold.co/600x400/ec4899/ffffff?text=Art+%26+Craft',
        description: 'Peralatan seni, kerajinan tangan, dan DIY'
    },
    {
        name: 'Music',
        slug: 'music',
        type: 'icon',
        value: HiOutlineMusicalNote,
        heroImage: 'https://placehold.co/600x400/f59e0b/ffffff?text=Music',
        description: 'Alat musik dan aksesoris musik'
    },
    {
        name: 'Photography',
        slug: 'photography',
        type: 'icon',
        value: HiOutlineCamera,
        heroImage: 'https://placehold.co/600x400/10b981/ffffff?text=Photography',
        description: 'Kamera, lensa, dan aksesoris fotografi'
    },
    {
        name: 'Books & Comics',
        slug: 'books-comics',
        type: 'icon',
        value: HiOutlineBookOpen,
        heroImage: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Books+%26+Comics',
        description: 'Buku, komik, manga, dan novel grafis'
    },
    {
        name: 'Collectibles',
        slug: 'collectibles',
        type: 'icon',
        value: HiOutlineShoppingBag,
        heroImage: 'https://placehold.co/600x400/ef4444/ffffff?text=Collectibles',
        description: 'Barang koleksi langka dan eksklusif'
    },

];

// Common product tags
export const tags = [
    // Action Figure tags
    'Marvel',
    'DC Comics',
    'Star Wars',
    'Anime',
    'Transformers',
    'Hot Toys',
    'Nendoroid',
    'Figma',

    // Model Kits tags
    'Gundam',
    'Bandai',
    'Master Grade',
    'High Grade',
    'Real Grade',
    'Perfect Grade',

    // Games tags
    'Board Game',
    'Card Game',
    'Puzzle',
    'Strategy',
    'Family Game',

    // Sport tags
    'Running',
    'Cycling',
    'Fitness',
    'Outdoor',
    'Camping',

    // Art & Craft tags
    'Painting',
    'Drawing',
    'Sculpting',
    'DIY',
    'Handmade',

    // General tags
    'Limited Edition',
    'Pre-Order',
    'New Arrival',
    'Best Seller',
    'Sale',
    'Imported',
    'Original',
    'Replica',
];

export const getCategoryBySlug = (slug) => {
    return categories.find(category => category.slug === slug);
};

export const getTagsByPrefix = (prefix) => {
    if (!prefix) return tags;
    return tags.filter(tag => tag.toLowerCase().includes(prefix.toLowerCase()));
};
