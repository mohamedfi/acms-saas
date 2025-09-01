<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DietaryRequirement;

class DietaryRequirementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dietaryRequirements = [
            [
                'name' => 'Vegetarian',
                'description' => 'No meat, fish, or poultry. Includes dairy and eggs.',
                'category' => 'preference',
                'restrictions' => 'Meat, fish, poultry',
                'allowed_foods' => 'Dairy, eggs, grains, vegetables, fruits, legumes',
                'substitutions' => 'Plant-based proteins, tofu, tempeh, seitan',
                'requires_medical_attention' => false,
                'icon' => '🥬',
                'color' => 'text-green-600',
                'is_active' => true,
            ],
            [
                'name' => 'Vegan',
                'description' => 'No animal products including dairy, eggs, and honey.',
                'category' => 'preference',
                'restrictions' => 'All animal products, dairy, eggs, honey',
                'allowed_foods' => 'Plant-based foods only',
                'substitutions' => 'Plant milk, nutritional yeast, agave nectar',
                'requires_medical_attention' => false,
                'icon' => '🌱',
                'color' => 'text-green-700',
                'is_active' => true,
            ],
            [
                'name' => 'Halal',
                'description' => 'Food prepared according to Islamic dietary laws.',
                'category' => 'religious',
                'restrictions' => 'Pork, alcohol, non-halal meat',
                'allowed_foods' => 'Halal-certified meat, fish, dairy, grains, vegetables',
                'substitutions' => 'Halal-certified alternatives',
                'requires_medical_attention' => false,
                'icon' => '☪️',
                'color' => 'text-blue-600',
                'is_active' => true,
            ],
            [
                'name' => 'Gluten-Free',
                'description' => 'No wheat, barley, rye, or cross-contaminated foods.',
                'category' => 'dietary_restriction',
                'restrictions' => 'Wheat, barley, rye, oats (unless certified gluten-free)',
                'allowed_foods' => 'Rice, quinoa, corn, gluten-free grains, vegetables, fruits',
                'substitutions' => 'Gluten-free flour, pasta, bread',
                'requires_medical_attention' => true,
                'medical_notes' => 'May be due to celiac disease or gluten sensitivity',
                'icon' => '🌾',
                'color' => 'text-orange-600',
                'is_active' => true,
            ],
            [
                'name' => 'Dairy-Free',
                'description' => 'No milk, cheese, yogurt, or other dairy products.',
                'category' => 'dietary_restriction',
                'restrictions' => 'Milk, cheese, yogurt, butter, cream',
                'allowed_foods' => 'Plant milk, dairy-free alternatives, vegetables, fruits, grains',
                'substitutions' => 'Almond milk, coconut milk, cashew cheese',
                'requires_medical_attention' => true,
                'medical_notes' => 'May be due to lactose intolerance or dairy allergy',
                'icon' => '🥛',
                'color' => 'text-red-600',
                'is_active' => true,
            ],
            [
                'name' => 'Nut-Free',
                'description' => 'No peanuts, tree nuts, or nut products.',
                'category' => 'allergy',
                'restrictions' => 'Peanuts, almonds, walnuts, cashews, pecans, etc.',
                'allowed_foods' => 'Seeds, legumes, grains, vegetables, fruits',
                'substitutions' => 'Sunflower seeds, pumpkin seeds, soy products',
                'requires_medical_attention' => true,
                'medical_notes' => 'Severe allergic reaction risk',
                'icon' => '⚠️',
                'color' => 'text-red-700',
                'is_active' => true,
            ],
            [
                'name' => 'Low-Sodium',
                'description' => 'Reduced salt and sodium content.',
                'category' => 'dietary_restriction',
                'restrictions' => 'High-sodium foods, processed foods, added salt',
                'allowed_foods' => 'Fresh vegetables, fruits, lean proteins, whole grains',
                'substitutions' => 'Herbs, spices, lemon juice, vinegar for flavor',
                'requires_medical_attention' => true,
                'medical_notes' => 'Often prescribed for heart conditions or hypertension',
                'icon' => '🧂',
                'color' => 'text-purple-600',
                'is_active' => true,
            ],
            [
                'name' => 'Diabetic-Friendly',
                'description' => 'Low glycemic index foods suitable for diabetics.',
                'category' => 'dietary_restriction',
                'restrictions' => 'High-sugar foods, refined carbohydrates, sugary beverages',
                'allowed_foods' => 'Complex carbohydrates, lean proteins, vegetables, low-sugar fruits',
                'substitutions' => 'Stevia, erythritol, whole grain alternatives',
                'requires_medical_attention' => true,
                'medical_notes' => 'Requires blood sugar monitoring',
                'icon' => '🩸',
                'color' => 'text-blue-700',
                'is_active' => true,
            ],
        ];

        foreach ($dietaryRequirements as $requirement) {
            DietaryRequirement::create($requirement);
        }
    }
}
