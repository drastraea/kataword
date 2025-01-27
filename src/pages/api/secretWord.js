import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Helper function to encrypt the word
function encryptWord(word) {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const iv = process.env.IV;

    if (!encryptionKey || !iv) {
        throw new Error('ENCRYPTION_KEY or IV is not defined in environment variables.');
    }

    // Decode base64-encoded ENCRYPTION_KEY and IV into Buffers
    const keyBuffer = Buffer.from(encryptionKey, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');

    // Check if the IV is 16 bytes long
    if (ivBuffer.length !== 16) {
        throw new Error('Invalid IV length. It must be 16 bytes.');
    }

    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    let encrypted = cipher.update(word, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export default function handler(req, res) {
    const secretWords = {
        english: ["Apple", "Table", "Chair", "House", "Water", "Light", "Green", "Blue", "Peace", "Money",
            "Happy", "Sad", "Love", "Laugh", "Dream", "Music", "World", "Books", "Work", "Night",
            "Morning", "Sun", "Moon", "Star", "Fire", "Wind", "Tree", "Flower", "Bird", "Fish",
            "Earth", "Sky", "Cloud", "Mountain", "River", "Ocean", "Desert", "Forest", "City", "Town",
            "Village", "Street", "Building", "School", "University", "Teacher", "Student", "Library", "Class",
            "Lesson", "Test", "Exam", "Knowledge", "Wisdom", "Science", "Math", "History", "Art",
            "Computer", "Phone", "Camera", "Game", "Sport", "Ball", "Basket", "Football",
            "Tennis", "Golf", "Dance", "Movie", "TV", "Video", "Picture", "Photo", "Magazine", "Newspaper",
            "Song", "Band", "Concert", "Artist", "Singer", "Actor", "Director", "Writer", "Reader",
            "Poem", "Story", "Novel", "Journal", "Poetry", "Article", "Blog", "Website", "Internet",
            "Social", "Media", "Call", "Text", "Message", "Email", "Post", "Letter", "Package", "Gift", "Present",
            "Shopping", "Store", "Market", "Food", "Drink", "Restaurant", "Cafe", "Bar", "Kitchen", "Cook",
            "Meal", "Breakfast", "Lunch", "Dinner", "Snack", "Fruit", "Vegetable", "Meat", "Bread",
            "Rice", "Cake", "Candy", "Chocolate", "Ice", "Sugar", "Salt", "Pepper", "Oil",
            "Milk", "Juice", "Tea", "Coffee", "Beer", "Wine", "Whiskey", "Cocktail", "Health",
            "Exercise", "Fitness", "Body", "Gym", "Yoga", "Running", "Walking", "Swimming", "Cycling",
            "Hiking", "Climbing", "Weight", "Strength", "Muscle", "Diet", "Vitamins", "Nutrition", "Medicine",
            "Doctor", "Nurse", "Hospital", "Clinic", "Patient", "Treatment", "Disease", "Cure",
            "Sick", "Pain", "Headache", "Fever", "Cold", "Flu", "Cough", "Infection", "Wound",
            "First", "Aid", "Emergency", "Ambulance", "Surgery", "Recovery", "Prevention",
            "Vaccination", "Therapy", "Symptom", "Checkup", "Diagnosis", "Prescription", "Beauty", "Skin", "Hair", "Nail",
            "Makeup", "Perfume", "Cosmetic", "Spa", "Salon", "Parlor", "Facial", "Shampoo", "Conditioner", "Toothbrush",
            "Toothpaste", "Shaving", "Beard", "Moustache", "Lotion", "Cream", "Soap", "Deodorant", "Shower", "Bath",
            "Towel", "Brush", "Comb", "Mirror", "Scissors", "Tweezers", "Razor", "Hygiene", "Grooming", "Fragrance",
            "Glasses", "Sunglasses", "Hat", "Shirt", "Pants", "Jeans", "Shorts", "Dress", "Suit", "Jacket", "Coat",
            "Scarf", "Sweater", "Shoes", "Socks", "Boots", "Gloves", "Bag", "Purse", "Wallet", "Backpack",
            "T-shirt", "Tie", "Trousers", "Skirt", "Jumpsuit", "Lingerie", "Sleepwear", "Nightgown", "Pajamas",
            "Clothes", "Laundry", "Iron", "Hanger", "Washer", "Dryer", "Detergent", "Fabric", "Softener", "Stain", "Wrinkle",
            "Press", "Folding", "Cleaning", "Washing", "Baking", "Grilling", "Frying", "Roasting",
            "Boiling", "Steaming", "Cutting", "Peeling", "Chopping", "Blending", "Mixing", "Tasting",
            "Flavor", "Spices", "Sauce", "Vinegar", "Soup", "Broth", "Stew", "Salad", "Vegetables", "Chicken", "Beef",
            "Pork", "Lamb", "Shrimp", "Tuna", "Salmon", "Crab", "Squid", "Lobster", "Noodles", "Pasta", "Rolls",
            "Pie", "Pastry", "Cupcake", "Cookie", "Gummy", "Lollipop", "Toffee", "Caramel", "Syrup",
            "Sweets", "Dessert", "Soda", "Vodka", "Gin", "Rum", "Cider", "Liquor", "Champagne", "Mixers", "Spirits", "Beverage",
            "Toast", "Cheers", "Party", "Celebration", "Event", "Meeting", "Conference", "Convention",
            "Exhibition", "Trade", "Fair", "Booth", "Stand", "Display", "Mall", "Retail", "Online", "Order", "Purchase", "Buy",
            "Sell", "Auction", "Sale", "Discount", "Offer", "Price", "Cost", "Budget", "Expensive", "Cheap", "Free", "Deal", "Bargain",
            "Coupon", "Code", "Promo", "Transaction", "Payment", "Checkout", "Cart", "Receipt", "Invoice", "Bank", "Account",
            "Balance", "Loan", "Debt", "Credit", "Debit", "Cash", "Banking", "Finance", "Investment", "Savings", "Currency",
            "Exchange", "Stock", "Bond", "Share", "Portfolio", "Assets", "Liabilities", "Equity", "Risk", "Insurance", "Policy",
            "Claim", "Premium", "Underwriting", "Broker", "Fund", "Return", "Dividend", "Capital", "Profit", "Loss", "Retirement",
            "Pension", "Wealth", "Growth", "Income", "Salary", "Tax", "Deduction", "Allowance", "Benefit", "Wages", "Employment",
            "Job", "Career", "Workplace", "Company", "Office", "Corporation", "Business", "Industry", "Leadership", "Management",
            "Team", "Human", "Resources", "Performance", "Appraisal", "Workload", "Task", "Project", "Employee", "Employer", "Labor",
            "Union", "Rights", "Contract", "Negotiation", "Bonus", "Increase", "Promotion", "Respect", "Ethics", "Culture",
            "Inclusion", "Diversity", "Training", "Development", "Talent", "Recruitment", "Interview", "Resume", "Cover", "Letter",
            "Position", "Offer", "Rejection", "Opportunity", "Skills", "Experience", "Opportunities"
        ],
        indonesian: ["Angka", "Layar", "Bunga", "Tinta", "Kunci", "Rantai", "Meja", "Pintu", "Daun", "Listrik",
            "Batu", "Cinta", "Gajah", "Sapi", "Taman", "Kapal", "Jalan", "Makan", "Pohon", "Rumah", "Kota",
            "Raja", "Mata", "Air", "Hujan", "Bulan", "Surya", "Kucing", "Anjing", "Ikan", "Burung", "Lumba",
            "Rusa", "Kuda", "Babi", "Harimau", "Hati", "Suara", "Mimpi", "Senyum", "Tahu", "Laut", "Gunung",
            "Bumi", "Langit", "Jendela", "Lantai", "Atap", "Dinding", "Kaca", "Lemari", "Meja", "Kursi",
            "Sajadah", "Bantal", "Kasur", "Selimut", "Piring", "Cangkir", "Sendok", "Garpu", "Pisau", "Mangkuk",
            "Ember", "Gereja", "Handuk", "Sapu", "Kamera", "Televisi", "Radio", "Komputer", "Laptop", "Handphone",
            "Tablet", "Internet", "Email", "Sosial", "Media", "Alam", "Penyanyi", "Musik", "Lagu",
            "Album", "Grup", "Band", "Orkestra", "Piano", "Gitar", "Drum", "Saksofon", "Biola", "Terompet", "Seruling",
            "Keyboard", "Vokal", "Bass", "Gitaris", "Pemain", "Lomba", "Kompetisi", "Turnamen", "Tantangan", "Hadiah",
            "Trofi", "Medali", "Kemenangan", "Kalah", "Pemenang", "Peserta", "Juri", "Penonton", "Pendukung",
            "Pengembang", "Penggemar", "Pengajar", "Tanding", "Olahraga", "Sepakbola", "Basket", "Bulu", "Tenis",
            "Golf", "Renang", "Motor", "Mobil", "Sepeda", "Beca", "Kereta", "Pesawat", "Bus", "Truk", "Mikrolet",
            "Taksi", "Ojek", "Helikopter", "Kapten", "Pilot", "Astronot", "Dunia", "Planet", "Galaksi", "Bintang",
            "Matahari", "Angkasa", "Kosmos", "Cuaca", "Suhu", "Temperatur", "Angin", "Awan", "Petir", "Kilatan",
            "Badai", "Tsunami", "Gempa", "Banjir", "Kebakaran", "Pencemaran", "Polusi", "Selamat", "Aman", "Perang",
            "Damai", "Kehidupan", "Mati", "Lahir", "Waktu", "Detik", "Menit", "Jam", "Hari", "Minggu", "Tahun", "Abad",
            "Era", "Sejarah", "Masa", "Sekolah", "Pendidikan", "Guru", "Siswa", "Pelajar", "Tugas", "Ujian", "Kelulusan",
            "Jurusan", "Proyek", "Praktikum", "Perkuliahan", "Mahasiswa", "Universitas", "Kampus", "Kelas", "Buku",
            "Pensil", "Pulpen", "Kertas", "Penghapus", "Rautan", "Tas", "Sampul", "Peta", "Atlas", "Globe", "Komik",
            "Novel", "Cerpen", "Majalah", "Koran", "Berita", "Artikel", "Jurnal", "Blog", "Podcast", "Video", "Teater",
            "Drama", "Film", "Sinetron", "Acara", "Reality", "Bioskop", "Panggung", "Musical", "Konser", "Aktivitas",
            "Kesibukan", "Pekerjaan", "Rencana", "Tujuan", "Target", "Produktif", "Produktivitas", "Prestasi", "Karir",
            "Pekerja", "Karyawan", "Perusahaan", "Pengusaha", "Usaha", "Kerja", "Upaya", "Keberhasilan", "Gagal", "Progres",
            "Maju", "Kembang", "Inovasi", "Perubahan", "Reformasi", "Ekonomi", "Krisis", "Industri", "Perdagangan", "Bisnis",
            "Pemasaran", "Penjualan", "Layanan", "Harga", "Pelanggan", "Pemasukan", "Keuntungan", "Kerugian", "Modal", "Investasi",
            "Dividen", "Saham", "Obligasi", "Reksadana", "Bank", "Pinjaman", "Tabungan", "Kartu", "Kredit", "Asuransi",
            "Jaminan", "Rekening", "Bunga", "Deposito", "Uang", "Koin", "Dompet", "ATM", "Cek", "Transfer", "Debit", "Saldo",
            "Laporan", "Statistik"]

    }

    const { language = 'en' } = req.query;

    if (!['en', 'id'].includes(language)) {
        return res.status(400).json({
            error: "Invalid language selection. Choose 'en' for English or 'id' for Indonesian."
        });
    }

    const wordList = language === 'en' ? secretWords.english : secretWords.indonesian;
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

    const secretWord = encryptWord(randomWord);
    let message;

    const response = language === 'en'
        ? { secretWord, message: "Looking for something?" }
        : { kataRahasia: secretWord, message: "Nyari apa kak?" };

    return res.status(200).json(response);

}