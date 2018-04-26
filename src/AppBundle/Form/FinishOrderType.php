<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FinishOrderType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', HiddenType::class, [

            ])
            ->add('surname', TextType::class, [
                'required' => true,
                'label'=>'surname',
                'attr' => [
                    'placeholder' => 'surname',
                ]
            ])
            ->add('phone', HiddenType::class, [

            ])
//            ->add('email', EmailType::class, [
//                'required' => true,
//                'label'=>'email',
//                'attr' => [
//                    'placeholder' => 'email',
//                ],
//            ])
            ->add('city', TextType::class, [
                'required' => true,
                'label'=>'city',
                'attr' => [
//                    'placeholder' => 'city',
                ],

            ])
            ->add('postOffice', TextType::class, [
                'required' => true,
                'label'=>'post.office',
                'attr' => [
//                    'placeholder' => 'post.office',
                ],

            ])
            ->add('quantity', HiddenType::class, [

            ])
            // 3 types : by_post/self_checkout/by_post_address
            ->add('deliveryType', HiddenType::class,[
                'data'=>'self_checkout'
            ])
            // 2 types : by_card/after_delivery
            ->add('paymentMethod', HiddenType::class,[
                'data'=>'by_card'
            ])
            ->add('price', HiddenType::class,[
                'mapped'=>true
            ])
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Ordering'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_ordering';
    }


}
