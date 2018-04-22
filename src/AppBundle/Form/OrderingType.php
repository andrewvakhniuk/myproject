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

class OrderingType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'required' => true,
                'label'=>'name',
                'attr' => [
                    'placeholder' => 'name',
                ]
            ])
            ->add('surname', TextType::class, [
                'required' => true,
                'label'=>'surname',
                'attr' => [
                    'placeholder' => 'surname',
                ]
            ])
            ->add('phone', TextType::class, [
                'required' => true,
                'label'=>'phone',
                'attr' => [
                    'placeholder' => '098555555',
                ],
            ])
            ->add('email', EmailType::class, [
                'required' => true,
                'label'=>'email',
                'attr' => [
                    'placeholder' => 'email',
                ],


            ])
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
            ->add('quantity', NumberType::class, [
                'required' => true,
                'label'=>'quantity',
                'data'=>1,
                'attr' => [
                    'placeholder' => 'quantity',
                ],

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
