/**
 * Quick test for enhanced AI insights and gamification
 */

const { analyzeGitHubUser } = require('./src/services/github/analyzer');
const { generateGitHubInsights } = require('./src/services/ai/insights');

async function testEnhancedInsights() {
    try {
        console.log('🧪 Testing Enhanced DevIntel Features\n');

        // Test with a real GitHub user (using a popular account)
        const testUsername = 'torvalds'; // Linus Torvalds - good test case

        console.log(`📊 Analyzing GitHub user: ${testUsername}...`);
        const analyzedData = await analyzeGitHubUser(testUsername);

        console.log('\n✅ Analysis Complete!');
        console.log(`   - Repositories: ${analyzedData.repositories.length}`);
        console.log(`   - Total Commits: ${analyzedData.contributions.totalCommits}`);
        console.log(`   - Dev Score: ${analyzedData.metrics.devScore}/100`);
        console.log(`   - Primary Tech: ${analyzedData.metrics.primaryTechIdentity}`);

        console.log('\n🤖 Generating AI Insights...');
        const insights = await generateGitHubInsights(analyzedData);

        console.log('\n✨ AI Insights Generated!');
        console.log('\n📊 Gamification:');
        console.log(`   - Level: ${insights.gamification.level.level} (${insights.gamification.level.tier})`);
        console.log(`   - Total XP: ${insights.gamification.level.totalXP.toLocaleString()}`);
        console.log(`   - Achievements: ${insights.gamification.achievements.length}`);

        console.log('\n🎭 Personality:');
        console.log(`   - Archetype: ${insights.personality.archetype}`);
        console.log(`   - Coding Style: ${insights.personality.codingStyle}`);
        console.log(`   - Strengths: ${insights.personality.strengths.join(', ')}`);

        console.log('\n📈 Growth Trajectory:');
        console.log(`   - Current Level: ${insights.growthTrajectory.currentLevel}`);
        console.log(`   - Next Milestone: ${insights.growthTrajectory.nextMilestone}`);
        console.log(`   - Recommendations: ${insights.growthTrajectory.recommendations.length}`);

        console.log('\n🏆 Top Achievements:');
        insights.gamification.achievements.slice(0, 5).forEach(achievement => {
            console.log(`   ${achievement.icon} ${achievement.name} (${achievement.rarity})`);
        });

        console.log('\n✅ All tests passed! Enhanced features working correctly.\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run test
testEnhancedInsights();
