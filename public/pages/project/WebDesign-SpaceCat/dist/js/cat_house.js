//สร้าง object ของ product
const product = [
    {
        id: 0,
        image: './img/house/house_1.jpg',
        title: 'บ้านไม้สั่งทำพิเศษ ขนาดเล็ก',
        price: 329,
        page: 'house_1',
        type: 'ไม้',
    },
    {
        id: 1,
        image: './img/house/house_2.jpg',
        title: 'บ้านกระดาษลัง Petique',
        price: 179,
        page: 'house_2',
        type: 'กระดาษ',
    },
    {
        id: 2,
        image: './img/house/house_3.jpg',
        title: 'บ้านกล่องผ้า Peitect Pet ',
        price: 499,
        page: 'house_3',
        type: 'ผ้า',
    },
    {
        id: 3,
        image: './img/house/house_4.jpg',
        title: 'บ้านไม้สั่งทำพิเศษ',
        price: 699,
        page: 'house_4',
        type: 'ไม้',
    },
    {
        id: 4,
        image: './img/house/house_5.jpg',
        title: 'คอนโดแมว แบบที่ 1',
        price: 399,
        page: 'house_5',
        type: 'คอนโด',
    },
    {
        id: 5,
        image: './img/house/house_6.jpg',
        title: 'บ้านกระดาษลัง ขนาดใหญ่',
        price: 289,
        page: 'house_6',
        type: 'กระดาษ',
    },
];

const filterButton = document.getElementById('filter-button');
const clearFilterButton = document.getElementById('clear-filter');
const searchBar = document.getElementById('search-bar');
const clearFilterWrap = document.getElementsByClassName('clearFilter-wrap')[0]
const broomWide = document.getElementsByClassName('fa-broom-wide')[0]

//สร้างอาร์เรย์ categories เป็นรายการสินค้าทั้งหมดโดยใช้ map ดึงข้อมูล title ของแต่ละสินค้า และ Set เพื่อลบอันที่ซ้ำกัน.
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