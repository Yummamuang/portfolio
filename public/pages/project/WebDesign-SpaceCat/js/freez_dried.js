//สร้าง object ของ product
const product = [
    {
        id: 0,
        image: './img/freez_dried_food/freez_dried_food_1.jpg',
        title: 'Northwest Naturals freez dried เนื้อไก่',
        price: 229,
        weight: '312 g',
        page: 'freez_dried_food_1',
        type: 'เนื้อไก่',
    },
    {
        id: 1,
        image: './img/freez_dried_food/freez_dried_food_2.jpg',
        title: 'Nulu freestyle freez dried เนื้อไก่ และแซลมอน',
        price:   109,
        weight: '99 g',
        page: 'freez_dried_food_2',
        type: 'เนื้อไก่',
    },
    {
        id: 2,
        image: './img/freez_dried_food/freez_dried_food_3.jpg',
        title: 'Nulu freestyle freez dried เนื้อเป็ด',
        price: 99,
        weight: '99 g',
        page: 'freez_dried_food_3',
        type: 'เนื้อเป็ด',
    },
    {
        id: 3,
        image: './img/freez_dried_food/freez_dried_food_4.jpg',
        title: 'Rawbble freez dried เนื้อไก่',
        price: 199,
        weight: '283 g',
        page: 'freez_dried_food_4',
        type: 'เนื้อไก่',
    },
    {
        id: 4,
        image: './img/freez_dried_food/freez_dried_food_5.jpg',
        title: 'Instinct freez dried เนื้อกระต่าย',
        price: 109,
        weight: '170 g',
        page: 'freez_dried_food_5',
        type: 'เนื้อกระต่าย',
    },
    {
        id: 5,
        image: './img/freez_dried_food/freez_dried_food_6.jpg',
        title: 'Boss Cat freez dried เนื้อไก่',
        price:  199,
        weight: '255 g',
        page: 'freez_dried_food_6',
        type: 'เนื้อไก่',
    },
    {
        id: 6,
        image: './img/freez_dried_food/freez_dried_food_7.jpg',
        title: 'Purpose freez dried เนื้อกระต่าย',
        price: 169,
        weight: '255 g',
        page: 'freez_dried_food_7',
        type: 'เนื้อกระต่าย',
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
        let { image, title, price, page, weight } = item;
        return (
            `<div class="items mt-8 mx-auto sm:mt-10">
                <div class="image overflow-hidden cursor-pointer" onclick="loadToPage('${page}')">
                    <img src="${image}" alt="${title}">
                </div>
                <div class="product-name cursor-pointer mt-4" onclick="loadToPage('${page}')">
                    ${title}
                </div>
                <div class="product-price mt-2">
                    ${price} ฿ (${weight})
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