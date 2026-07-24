@props([
    'title' => 'Aakrithi | Premium Women\'s Ethnic Wear & Designer Kids Clothing Boutique',
    'description' => 'Discover Aakrithi – your destination for designer ethnic wear, handloom sarees, and trendy kids\' party wear. From traditional kurtis to festive children\'s outfits, find timeless style for the whole family.',
    'keywords' => 'Aakrithi, women\'s ethnic wear online, designer sarees India, kids party wear, traditional kids clothing, handcrafted Indian boutique, sustainable fashion, designer kurtis, Kerala sarees, festive children\'s outfits, newborn baby clothes online, bridal ethnic wear, artisanal fashion',
    'image' => asset('images/logo.png'),
    'url' => url()->current(),
    'isNoindex' => false,
])

<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}">
<meta name="keywords" content="{{ $keywords }}">
<link rel="canonical" href="{{ $url }}" />

@if($isNoindex)
<meta name="robots" content="noindex, nofollow">
@else
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
@endif

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="{{ $url }}">
<meta property="og:title" content="{{ $title }}">
<meta property="og:description" content="{{ $description }}">
<meta property="og:image" content="{{ $image }}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="{{ $url }}">
<meta property="twitter:title" content="{{ $title }}">
<meta property="twitter:description" content="{{ $description }}">
<meta property="twitter:image" content="{{ $image }}">
