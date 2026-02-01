/* =========================================
   DECODE THE WORD - TRANSLATION SYSTEM
   Multi-language support for EAL learners
   Phase 3: Translation Infrastructure
   ========================================= */

(function () {
  
  // Supported languages with native names
  window.SUPPORTED_LANGUAGES = {
    es: { name: "Spanish", native: "Español", flag: "🇪🇸", dir: "ltr" },
    zh: { name: "Mandarin", native: "中文", flag: "🇨🇳", dir: "ltr" },
    ar: { name: "Arabic", native: "العربية", flag: "🇸🇦", dir: "rtl" },
    vi: { name: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳", dir: "ltr" },
    tl: { name: "Tagalog", native: "Tagalog", flag: "🇵🇭", dir: "ltr" },
    pt: { name: "Portuguese", native: "Português", flag: "🇧🇷", dir: "ltr" },
    fr: { name: "French", native: "Français", flag: "🇫🇷", dir: "ltr" },
    hi: { name: "Hindi", native: "हिन्दी", flag: "🇮🇳", dir: "ltr" }
  };

  // Translation data structure
  window.TRANSLATIONS = {
    cat: {
      es: { 
        word: "gato", 
        def: "Un animal pequeño con pelaje que maúlla.",
        sentence: "El gato se sentó en la alfombra y ronroneó suavemente.",
        phonetic: "GAH-toh"
      },
      zh: { 
        word: "猫", 
        def: "一种会叫的小动物，是常见的宠物。",
        sentence: "猫静静地坐在垫子上。",
        phonetic: "māo"
      },
      ar: { 
        word: "قطة", 
        def: "حيوان صغير مع فراء يموء.",
        sentence: "القطة جلست على السجادة بهدوء.",
        phonetic: "qiṭṭa"
      },
      vi: { 
        word: "con mèo", 
        def: "Một động vật nhỏ có lông, kêu meo meo.",
        sentence: "Con mèo ngồi trên tấm thảm và kêu nhẹ nhàng.",
        phonetic: "kon mɛːw"
      },
      tl: { 
        word: "pusa", 
        def: "Isang maliit na hayop na may balahibo at umiingaw.",
        sentence: "Ang pusa ay umupo sa banig at humuni nang mahinahon.",
        phonetic: "poo-sah"
      },
      pt: { 
        word: "gato", 
        def: "Um pequeno animal com pelo que mia.",
        sentence: "O gato sentou no tapete e ronronou suavemente.",
        phonetic: "GAH-too"
      },
      fr: { 
        word: "chat", 
        def: "Un petit animal avec de la fourrure qui miaule.",
        sentence: "Le chat s'est assis sur le tapis et a ronronné doucement.",
        phonetic: "shah"
      },
      hi: { 
        word: "बिल्ली", 
        def: "एक छोटा जानवर जिसके बाल होते हैं और जो म्याऊं करता है।",
        sentence: "बिल्ली चटाई पर बैठी और धीरे से म्याऊं की।",
        phonetic: "bil-lee"
      }
    },

    dog: {
      es: { 
        word: "perro", 
        def: "Un animal leal que a menudo se mantiene como mascota.",
        sentence: "Los perros leen el lenguaje corporal humano mejor que los lobos.",
        phonetic: "PEH-rroh"
      },
      zh: { 
        word: "狗", 
        def: "一种忠诚的动物，常被当作宠物饲养。",
        sentence: "狗比狼更能理解人类的肢体语言。",
        phonetic: "gǒu"
      },
      ar: { 
        word: "كلب", 
        def: "حيوان مخلص يتم الاحتفاظ به كحيوان أليف.",
        sentence: "الكلاب تقرأ لغة الجسد البشرية أفضل من الذئاب.",
        phonetic: "kalb"
      },
      vi: { 
        word: "con chó", 
        def: "Một động vật trung thành thường được nuôi làm thú cưng.",
        sentence: "Chó hiểu ngôn ngữ cơ thể con người tốt hơn sói.",
        phonetic: "kon chɔ́"
      },
      tl: { 
        word: "aso", 
        def: "Isang tapat na hayop na madalas na pinapanatili bilang alaga.",
        sentence: "Ang mga aso ay mas nakakaintindi ng wika ng katawan ng tao kaysa sa mga lobo.",
        phonetic: "ah-soh"
      },
      pt: { 
        word: "cachorro", 
        def: "Um animal leal frequentemente mantido como animal de estimação.",
        sentence: "Os cães leem a linguagem corporal humana melhor que os lobos.",
        phonetic: "kah-SHOH-hoo"
      },
      fr: { 
        word: "chien", 
        def: "Un animal fidèle souvent gardé comme animal de compagnie.",
        sentence: "Les chiens lisent le langage corporel humain mieux que les loups.",
        phonetic: "shee-ehn"
      },
      hi: { 
        word: "कुत्ता", 
        def: "एक वफादार जानवर जिसे अक्सर पालतू जानवर के रूप में रखा जाता है।",
        sentence: "कुत्ते भेड़ियों से बेहतर मानव शारीरिक भाषा को समझते हैं।",
        phonetic: "kut-taa"
      }
    },

    sun: {
      es: { 
        word: "sol", 
        def: "La estrella en el centro de nuestro sistema solar.",
        sentence: "El sol proporciona energía para casi toda la vida en la Tierra.",
        phonetic: "sohl"
      },
      zh: { 
        word: "太阳", 
        def: "太阳系中心的恒星。",
        sentence: "太阳为地球上几乎所有生命提供能量。",
        phonetic: "tài yáng"
      },
      ar: { 
        word: "شمس", 
        def: "النجم في مركز نظامنا الشمسي.",
        sentence: "توفر الشمس الطاقة لكل الحياة تقريبًا على الأرض.",
        phonetic: "shams"
      },
      vi: { 
        word: "mặt trời", 
        def: "Ngôi sao ở trung tâm của hệ mặt trời.",
        sentence: "Mặt trời cung cấp năng lượng cho hầu hết sự sống trên Trái Đất.",
        phonetic: "mət trəːj"
      },
      tl: { 
        word: "araw", 
        def: "Ang bituin sa gitna ng ating solar system.",
        sentence: "Ang araw ay nagbibigay ng enerhiya para sa halos lahat ng buhay sa Daigdig.",
        phonetic: "ah-rao"
      },
      pt: { 
        word: "sol", 
        def: "A estrela no centro do nosso sistema solar.",
        sentence: "O sol fornece energia para quase toda a vida na Terra.",
        phonetic: "sohl"
      },
      fr: { 
        word: "soleil", 
        def: "L'étoile au centre de notre système solaire.",
        sentence: "Le soleil fournit de l'énergie pour presque toute la vie sur Terre.",
        phonetic: "soh-lay"
      },
      hi: { 
        word: "सूरज", 
        def: "हमारे सौर मंडल के केंद्र में स्थित तारा।",
        sentence: "सूरज पृथ्वी पर लगभग सभी जीवन के लिए ऊर्जा प्रदान करता है।",
        phonetic: "soo-raj"
      }
    },

    ship: {
      es: { 
        word: "barco", 
        def: "Un vehículo grande para viajar en el agua.",
        sentence: "Un barco flota porque su densidad total es menor que el agua.",
        phonetic: "BAR-koh"
      },
      zh: { 
        word: "船", 
        def: "一种在水上航行的大型交通工具。",
        sentence: "船能浮起来是因为它的总密度比水小。",
        phonetic: "chuán"
      },
      ar: { 
        word: "سفينة", 
        def: "مركبة كبيرة للسفر على الماء.",
        sentence: "تطفو السفينة لأن كثافتها الإجمالية أقل من الماء.",
        phonetic: "safīna"
      },
      vi: { 
        word: "con tàu", 
        def: "Một phương tiện lớn để đi lại trên nước.",
        sentence: "Tàu nổi vì tổng mật độ của nó nhỏ hơn nước.",
        phonetic: "kon tàu"
      },
      tl: { 
        word: "barko", 
        def: "Isang malaking sasakyan para sa paglalakbay sa tubig.",
        sentence: "Ang barko ay lumulutang dahil ang kabuuang density nito ay mas mababa kaysa sa tubig.",
        phonetic: "bar-koh"
      },
      pt: { 
        word: "navio", 
        def: "Um grande veículo para viajar na água.",
        sentence: "Um navio flutua porque sua densidade total é menor que a água.",
        phonetic: "nah-VEE-oh"
      },
      fr: { 
        word: "navire", 
        def: "Un grand véhicule pour voyager sur l'eau.",
        sentence: "Un navire flotte parce que sa densité totale est inférieure à celle de l'eau.",
        phonetic: "nah-veer"
      },
      hi: { 
        word: "जहाज़", 
        def: "पानी पर यात्रा करने के लिए एक बड़ा वाहन।",
        sentence: "जहाज़ तैरता है क्योंकि इसका कुल घनत्व पानी से कम होता है।",
        phonetic: "ja-haaz"
      }
    },

    rain: {
      es: { 
        word: "lluvia", 
        def: "Agua que cae de las nubes.",
        sentence: "La lluvia se forma cuando el vapor de agua se condensa en gotas.",
        phonetic: "YOO-vee-ah"
      },
      zh: { 
        word: "雨", 
        def: "从云中落下的水。",
        sentence: "雨是由水蒸气凝结成水滴形成的。",
        phonetic: "yǔ"
      },
      ar: { 
        word: "مطر", 
        def: "الماء الذي يسقط من الغيوم.",
        sentence: "يتشكل المطر عندما يتكثف بخار الماء إلى قطرات.",
        phonetic: "maṭar"
      },
      vi: { 
        word: "mưa", 
        def: "Nước rơi từ mây.",
        sentence: "Mưa hình thành khi hơi nước ngưng tụ thành giọt nước.",
        phonetic: "mɨə"
      },
      tl: { 
        word: "ulan", 
        def: "Tubig na bumabagsak mula sa mga ulap.",
        sentence: "Ang ulan ay nabubuo kapag ang singaw ng tubig ay nag-condense sa mga patak.",
        phonetic: "oo-lan"
      },
      pt: { 
        word: "chuva", 
        def: "Água caindo das nuvens.",
        sentence: "A chuva se forma quando o vapor de água se condensa em gotas.",
        phonetic: "SHOO-vah"
      },
      fr: { 
        word: "pluie", 
        def: "L'eau qui tombe des nuages.",
        sentence: "La pluie se forme lorsque la vapeur d'eau se condense en gouttes.",
        phonetic: "plwee"
      },
      hi: { 
        word: "बारिश", 
        def: "बादलों से गिरने वाला पानी।",
        sentence: "बारिश तब बनती है जब जल वाष्प बूंदों में संघनित होता है।",
        phonetic: "baa-rish"
      }
    },

    tree: {
      es: { 
        word: "árbol", 
        def: "Una planta grande con tronco y ramas.",
        sentence: "Un árbol puede vivir durante siglos creciendo nuevos anillos cada año.",
        phonetic: "AR-bohl"
      },
      zh: { 
        word: "树", 
        def: "一种有树干和树枝的大型植物。",
        sentence: "树可以活几个世纪，每年长出新的年轮。",
        phonetic: "shù"
      },
      ar: { 
        word: "شجرة", 
        def: "نبات كبير له جذع وفروع.",
        sentence: "يمكن للشجرة أن تعيش لقرون من خلال نمو حلقات جديدة كل عام.",
        phonetic: "shajara"
      },
      vi: { 
        word: "cây", 
        def: "Một loại cây lớn có thân và cành.",
        sentence: "Cây có thể sống hàng thế kỷ bằng cách tạo ra các vòng mới mỗi năm.",
        phonetic: "kəj"
      },
      tl: { 
        word: "puno", 
        def: "Isang malaking halaman na may puno at sanga.",
        sentence: "Ang puno ay maaaring mabuhay ng mga siglo sa pamamagitan ng paglaki ng mga bagong singsing bawat taon.",
        phonetic: "poo-noh"
      },
      pt: { 
        word: "árvore", 
        def: "Uma planta grande com tronco e galhos.",
        sentence: "Uma árvore pode viver por séculos crescendo novos anéis a cada ano.",
        phonetic: "AR-voh-ree"
      },
      fr: { 
        word: "arbre", 
        def: "Une grande plante avec un tronc et des branches.",
        sentence: "Un arbre peut vivre pendant des siècles en développant de nouveaux anneaux chaque année.",
        phonetic: "ar-bruh"
      },
      hi: { 
        word: "पेड़", 
        def: "एक बड़ा पौधा जिसमें तना और शाखाएं होती हैं।",
        sentence: "एक पेड़ हर साल नए छल्ले बनाकर सदियों तक जीवित रह सकता है।",
        phonetic: "pedh"
      }
    },

    bird: {
      es: { 
        word: "pájaro", 
        def: "Un animal de sangre caliente con plumas.",
        sentence: "Las aves evolucionaron de los dinosaurios durante millones de años.",
        phonetic: "PAH-hah-roh"
      },
      zh: { 
        word: "鸟", 
        def: "一种温血动物，有羽毛。",
        sentence: "鸟类是从恐龙经过数百万年演化而来的。",
        phonetic: "niǎo"
      },
      ar: { 
        word: "طائر", 
        def: "حيوان من ذوات الدم الحار له ريش.",
        sentence: "تطورت الطيور من الديناصورات على مدى ملايين السنين.",
        phonetic: "ṭāʼir"
      },
      vi: { 
        word: "chim", 
        def: "Động vật máu nóng có lông.",
        sentence: "Chim tiến hóa từ khủng long qua hàng triệu năm.",
        phonetic: "chim"
      },
      tl: { 
        word: "ibon", 
        def: "Isang mainit ang dugo na hayop na may balahibo.",
        sentence: "Ang mga ibon ay nag-evolve mula sa mga dinosaur sa loob ng milyun-milyong taon.",
        phonetic: "ee-bon"
      },
      pt: { 
        word: "pássaro", 
        def: "Um animal de sangue quente com penas.",
        sentence: "As aves evoluíram dos dinossauros ao longo de milhões de anos.",
        phonetic: "PAH-sah-roo"
      },
      fr: { 
        word: "oiseau", 
        def: "Un animal à sang chaud avec des plumes.",
        sentence: "Les oiseaux ont évolué à partir des dinosaures sur des millions d'années.",
        phonetic: "wah-zoh"
      },
      hi: { 
        word: "पक्षी", 
        def: "एक गर्म रक्त वाला जानवर जिसके पंख होते हैं।",
        sentence: "पक्षी लाखों वर्षों में डायनासोर से विकसित हुए।",
        phonetic: "pak-shee"
      }
    },

    hope: {
      es: { 
        word: "esperanza", 
        def: "Querer que algo suceda.",
        sentence: "La esperanza te sostiene en las dificultades, pero combínala con acción.",
        phonetic: "es-peh-RAN-sah"
      },
      zh: { 
        word: "希望", 
        def: "希望某事发生。",
        sentence: "希望能在困难中支持你，但要与行动相结合。",
        phonetic: "xī wàng"
      },
      ar: { 
        word: "أمل", 
        def: "أن تريد شيئًا أن يحدث.",
        sentence: "الأمل يدعمك خلال الصعوبات، لكن اجمعه مع العمل.",
        phonetic: "ʼamal"
      },
      vi: { 
        word: "hy vọng", 
        def: "Mong muốn điều gì đó xảy ra.",
        sentence: "Hy vọng giúp bạn vượt qua khó khăn, nhưng hãy kết hợp nó với hành động.",
        phonetic: "hi vɔŋ"
      },
      tl: { 
        word: "pag-asa", 
        def: "Nais na mangyari ang isang bagay.",
        sentence: "Ang pag-asa ay sumusuporta sa iyo sa kahirapan, ngunit isama ito sa aksyon.",
        phonetic: "pag-ah-sah"
      },
      pt: { 
        word: "esperança", 
        def: "Querer que algo aconteça.",
        sentence: "A esperança sustenta você nas dificuldades, mas combine-a com ação.",
        phonetic: "es-peh-RAN-sah"
      },
      fr: { 
        word: "espoir", 
        def: "Vouloir que quelque chose se produise.",
        sentence: "L'espoir vous soutient dans les difficultés, mais combinez-le avec l'action.",
        phonetic: "es-pwahr"
      },
      hi: { 
        word: "आशा", 
        def: "कुछ होने की इच्छा करना।",
        sentence: "आशा कठिनाई में आपका साथ देती है, लेकिन इसे कार्य के साथ मिलाएं।",
        phonetic: "aa-shaa"
      }
    }

    // More translations can be added progressively...
  };

  // Helper functions
  window.getTranslation = function(word, language) {
    if (!word || !language) return null;
    const translations = window.TRANSLATIONS[word.toLowerCase()];
    if (!translations) return null;
    return translations[language] || null;
  };

  window.hasTranslation = function(word, language) {
    return window.getTranslation(word, language) !== null;
  };

  window.getSupportedLanguages = function() {
    return Object.keys(window.SUPPORTED_LANGUAGES);
  };

  window.getLanguageInfo = function(langCode) {
    return window.SUPPORTED_LANGUAGES[langCode] || null;
  };

  // Text-to-speech helper with language support
  window.speakTranslation = function(text, langCode) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language codes to speech synthesis codes
    const langMap = {
      es: 'es-ES',
      zh: 'zh-CN',
      ar: 'ar-SA',
      vi: 'vi-VN',
      tl: 'tl-PH',
      pt: 'pt-BR',
      fr: 'fr-FR',
      hi: 'hi-IN'
    };
    
    utterance.lang = langMap[langCode] || 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    
    // Try to find appropriate voice
    const voices = speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    
    speechSynthesis.speak(utterance);
  };

  console.log("✓ Translation system loaded with", Object.keys(window.TRANSLATIONS).length, "words in", Object.keys(window.SUPPORTED_LANGUAGES).length, "languages");

})();
