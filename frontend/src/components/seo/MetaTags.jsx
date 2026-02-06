import React from 'react';
import { Helmet } from 'react-helmet-async';

export function MetaTags({
    title,
    description,
    image,
    url,
    type = 'website',
    author = 'DevIntel'
}) {
    const fullTitle = title ? `${title} | DevIntel` : 'DevIntel - Developer Intelligence Platform';
    const defaultDescription = 'Analyze GitHub profiles, compare developers, and get AI-powered insights about your coding journey.';
    const defaultImage = 'https://devintel.com/og-default.png';
    const siteUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://devintel.com');

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description || defaultDescription} />
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:site_name" content="DevIntel" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={siteUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
            <meta name="twitter:creator" content="@devintel" />

            {/* Additional SEO */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <link rel="canonical" href={siteUrl} />
        </Helmet>
    );
}

// Preset meta tags for common pages
export function HomeMetaTags() {
    return (
        <MetaTags
            title="Home"
            description="Discover your developer DNA. Analyze GitHub profiles, compare developers, and get AI-powered insights about your coding journey."
            url="https://devintel.com"
        />
    );
}

export function AnalysisMetaTags({ username }) {
    return (
        <MetaTags
            title={`${username}'s Developer Profile`}
            description={`Comprehensive analysis of ${username}'s GitHub activity, skills, and coding patterns powered by AI.`}
            url={`https://devintel.com/analyze/${username}`}
        />
    );
}

export function ComparisonMetaTags({ userA, userB }) {
    return (
        <MetaTags
            title={`${userA} vs ${userB} - Developer Battle`}
            description={`Head-to-head comparison of ${userA} and ${userB}. See who dominates in repos, commits, stars, and more!`}
            url={`https://devintel.com/compare?a=${userA}&b=${userB}`}
        />
    );
}

export function WrappedMetaTags({ username, year }) {
    return (
        <MetaTags
            title={`${username}'s ${year} Developer Wrapped`}
            description={`${username}'s coding journey in ${year}. Spotify Wrapped-style insights for developers.`}
            url={`https://devintel.com/wrapped/${username}/${year}`}
        />
    );
}
