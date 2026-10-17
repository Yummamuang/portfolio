//สร้าง object ของ product
const product = [
    {
        id: 0,
        image: './img/toys/jingle_ball_toy_1.jpg',
        title: 'Jingle ball แบบที่ 1',
        price: 49,
        page: 'jingle_ball_toy_1',
        type: 'ลูกบอล',
    },
    {
        id: 1,
        image: './img/toys/jingle_ball_toy_2.jpg',
        title: 'Jingle ball แบบที่ 2',
        price: 49,
        page: 'jingle_ball_toy_2',
        type: 'ลูกบอล',
    },
    {
        id: 2,
        image: './img/toys/jingle_ball_toy_3.jpg',
        title: 'Jingle ball แบบที่ 3',
        price: 39,
        page: 'jingle_ball_toy_3',
        type: 'ลูกบอล',
    },
    {
        id: 3,
        image: './img/toys/jingle_ball_toy_4.jpg',
        title: 'Jingle ball แบบที่ 4',
        price: 69,
        page: 'jingle_ball_toy_4',
        type: 'ลูกบอล',
    },
    {
        id: 4,
        image: './img/toys/mouse_toy_1.jpg',
        title: 'หนูปลอม แบบที่ 1',
        price: 109,
        page: 'mouse_toy_1',
        type: 'หนูปลอม',
    },
    {
        id: 5,
        image: './img/toys/mouse_toy_2.jpg',
        title: 'หนูปลอม แบบที่ 2',
        price: 99,
        page: 'mouse_toy_2',
        type: 'หนูปลอม',
    },
    {
        id: 6,
        image: './img/toys/mouse_toy_3.jpg',
        title: 'หนูปลอม แบบที่ 3',
        price: 49,
        page: 'mouse_toy_3',
        type: 'หนูปลอม',
    },
    {
        id: 7,
        image: './img/toys/mouse_toy_4.jpg',
        title: 'หนูปลอม แบบที่ 4',
        price: 139,
        page: 'mouse_toy_4',
        type: 'หนูปลอม',
    },
    {
        id: 8,
        image: './img/toys/mouse_toy_5.jpg',
        title: 'หนูปลอม แบบที่ 5',
        price: 219,
        page: 'mouse_toy_5',
        type: 'หนูปลอม',
    },
    {
        id: 9,
        image: './img/toys/wand_toy_1.jpg',
        title: 'ไม้ตกแมว แบบที่ 1',
        price: 109,
        page: 'wand_toy_1',
        type: 'ไม้ตกแมว',
    },
    {
        id: 10,
        image: './img/toys/wand_toy_2.jpg',
        title: 'ไม้ตกแมว แบบที่ 2',
        price: 79,
        page: 'wand_toy_2',
        type: 'ไม้ตกแมว',
    },
    {
        id: 11,
        image: './img/toys/wand_toy_3.jpg',
        title: 'ไม้ตกแมว แบบที่ 3',
        price: 199,
        page: 'wand_toy_3',
        type: 'ไม้ตกแมว',
    },
    {
        id: 12,
        image: './img/toys/wand_toy_4.jpg',
        title: 'ไม้ตกแมว แบบที่ 4',
        price: 69,
        page: 'wand_toy_4',
        type: 'ไม้ตกแมว',
    },
    {
        id: 13,
        image: './img/toys/wand_toy_5.jpg',
        title: 'ไม้ตกแมว แบบที่ 5',
        price: 79,
        page: 'wand_toy_5',
        type: 'ไม้ตกแมว',
    },

];

const filterButton = document.getElementById('filter-button');
const clearFilterButton = document.getElementById('clear-filter');
const searchBar = document.getElementById('search-bar');
const clearFilterWrap = document.getElementsByClassName('clearFilter-wrap')[0]
const broomWide = document.getElementsByClassName('fa-broom-wide')[0]

//สร้างอาร์เรย์ categories เป็นรายการสินค้าทั้งหมดโดยใช้ map ดึงข้อมูล title ของแต่ละสินค้า และ Set เพื่อลบรายการที่ซ้ำกัน.
const categories = [...new Set(product.map((item) => { return item }))]

// สร้างอาร์เรย์ของประเภทสินค้า
const typeProduct = [...new Set(product.map(item => item.type))];

//รับข้อมูลข้อความในช่องค้นหา และแปลงข้อความเป็นตัวพิมพ์เล็กทั้งหมด 
document.getElementById('search-bar').addEventListener('keyup', (e) => {
    const searchData = e.target.value.toLowerCase();

    //ใช้filter()ในการกรองรายการสินค้าจาก categories โดยเช็คว่า item.title มีข้อความที่ค้นหาอยู่หรือไม่ ถ้า item.title มีข้อความที่ค้นหา 
    //รายการสินค้านั้นจะใส้ไว้ใน filteredData
    const filteredData = categories.filter((item) => {
        return (item.title.toLowerCase().includes(searchData))
    })
    //หลังจากกรองสินค้าแล้ว รายการสินค้าที่ตรงกับที่ค้นหาจะส่งเข้าไปใน displayItem()
    displayItem(filteredData)
});

// แสดงสินค้าตามประเภท
filterByCategory = (category) => {
    //ลบคลาส active จากปุ่มที่มีคลาส active
    const activeFilterButtons = document.querySelectorAll('#filter-button button.active');
    activeFilterButtons.forEach(button => {
        button.classList.remove('active');
    });

    //เพิ่มคลาส active ให้กับปุ่มที่คลิก
    const clickedButton = document.querySelector(`#filter-button button[data-category="${category}"]`);
    clickedButton.classList.add('active');

    const filteredData = product.filter(item => item.type.toLowerCase() === category.toLowerCase());
    displayItem(filteredData);
}

// สร้างปุ่มประเภทสินค้า
typeProduct.forEach(category => {
    filterButton.innerHTML += `
        <button type="button" data-category="${category}" onclick="filterByCategory('${category}')" class="type-filter m-1">${category}</button>
    `;
});

/* รับสินค้า items ใช้ map เพื่อลูปสินค้าและสร้าง HTML 
สำหรับแต่ละรายการ และเอารายการทั้งหมดเข้าด้วยกันด้วย join('') */
const displayItem = (items) => {
    document.getElementById('house').innerHTML = items.map((item) => {
        let { image, title, price, page } = item;
        return (
            `<div class="items mt-8 mx-auto sm:mt-10">
                <div class="image overflow-hidden cursor-pointer" onclick="loadToPage('${page}')">
                    <img src="${image}" alt="${title}">
                </div>
                <div class="product-name cursor-pointer mt-4" onclick="loadToPage('${page}')">
                    ${title}
                </div>
                <div class="product-price mt-2">
                    ${price} ฿
                </div>
            </div>`
        )
    }).join('')
};

//แสดงรายการสินค้า
displayItem(categories)


clearFilter = () => {

    // ลบคลาส active จากปุ่มที่มีคลาส active
    const activeFilterButtons = document.querySelectorAll('#filter-button button.active');
    activeFilterButtons.forEach(button => {
        button.classList.remove('active');
    }); 

    //ล้างค่าค้นหา
    searchBar.value = '';

    //แสดงสินค้าทั้งหมด
    displayItem(product);

    //กำหนด style
    clearFilterWrap.style.pointerEvents = 'none';
    clearFilterWrap.style.transform = 'scale(0.9)';

    setTimeout(() => {
        clearFilterWrap.style.transform = 'scale(1)';
    }, 200);

    setTimeout(() => {
        broomWide.style.transform = 'rotate(-25deg)';
    }, 400);

    setTimeout(() => {
        broomWide.style.transform = 'rotate(5deg)';
    }, 700);

    setTimeout(() => {
        broomWide.style.transform = 'rotate(0deg)';
        clearFilterWrap.style.pointerEvents = 'auto';
    }, 1000);
}