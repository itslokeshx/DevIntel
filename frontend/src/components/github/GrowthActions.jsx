import React from 'react';
import { Card } from '../common/Card';
import { Lightbulb, Rocket } from 'lucide-react';

export function GrowthActions({ actions }) {
    if (!actions || actions.length === 0) return null;

    return (
        <Card padding="lg" variant="highlight">
            <div className="flex items-center space-x-2 mb-4">
                <Rocket className="h-6 w-6 text-accent-warning" />
                <h3 className="text-h3 font-bold text-light-text-primary dark:text-dark-text-primary">
                    Recommended Next Steps
                </h3>
            </div>

            <div className="space-y-3">
                {actions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-accent-warning mt-0.5 flex-shrink-0" />
                        <p className="text-body text-light-text-primary dark:text-dark-text-primary">
                            {action}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
