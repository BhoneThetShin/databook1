// book1.js data
const book1 = {
    keywords: ["ဘဂဝါ"],
    data: [
        { 
            keyword: "ဘဂဝါ",
            title: "သီလက္ခန္ဓဝဂ္ဂအဘိနဝဋီကာ (ပ) ။ နှာ - ၈၅",
            text: "တေန သမယေန ဗုဒ္ဓေါ ဘဂဝါ ဝေရဉ္ဇာယံ ဝိဟရတိ နဠေရုပုစိမန္ဒမူလေ မဟတာ ဘိက္ခုသံဃေန သဒ္ဓိံ ပဉ္စမတ္တေဟိ ဘိက္ခုသတေဟိ။ ...", 
            file: "databook.html" 
        }
    ]
};

// book2.js data
const book2 = {
    keywords: ["သယနာ", "ကာရကကဏ္ဍော"],
    data: [
        { 
            keyword: "သယနာ",
            title: "ပါရာဇိကဏ်ပါဠိ (ပ) ။ နှာ - ၁",
            text: "ဘဂဝါ သံဃာ...သယနာ (အပိုင်း ၁)", 
            file: "databook1.html" 
        },
        { 
            keyword: "ကာရကကဏ္ဍော",
            title: "ပါရာဇိကဏ်ပါဠိ (ပ) ။ နှာ - ၁",
            text: "ကာရကကဏ္ဍော အကြောင်း အသေးစိတ်ဖော်ပြချက်...", 
            file: "databook1.html" 
        }
    ]
};

// book3.js data
const book3 = {
    keywords: ["သီလံ", "ပါစိတ္တိယံ"],
    data: [
        { 
            keyword: "သီလံ",
            title: "ပါစိတ္တိယပါဠိ (ပ) ။ နှာ - ၁",
            text: "ဘဂဝါ သံဃာ...သီလံ သယနာ (အပိုင်း ၁)", 
            file: "databook1.html" 
        },
        { 
            keyword: "ပါစိတ္တိယံ",
            title: "ပါရာဇိကဏ်ပါဠိ (ပ) ။ နှာ - ၁",
            text: "ကာရကကဏ္ဍော ပါစိတ္တိယံအကြောင်း အသေးစိတ်ဖော်ပြချက်...", 
            file: "databook1.html" 
        }
    ]
};

// စာအုပ်အားလုံးကို တစ်ခုတည်းဖြစ်အောင် ပေါင်းစည်းခြင်း
const allBooks = [book1, book2,book3];
const combinedData = allBooks.flatMap(b => b.data);
const combinedKeywords = [...new Set(allBooks.flatMap(b => b.keywords))];

