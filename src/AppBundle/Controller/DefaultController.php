<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Ordering;
use AppBundle\Entity\Visit;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;


class DefaultController extends Controller
{


    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        // save ip address to visits and session
        $visitId = $this->get('session')->get('visit_id');
        $visit = null;
        if ($visitId !== null) {
            $visit = $em->getRepository('AppBundle:Visit')->find($visitId);
        }
        if ($visit === null) {
            $visit = new Visit();
            $visit->setDate(new \DateTime('now'));
            $visit->setIp($request->getClientIp());
            $em->persist($visit);
            $em->flush();
            $this->get('session')->set('visit_id', $visit->getId());
        }
        // END save ip address to visits

        // handle request wth ordering form
        $ordering = new Ordering();
        $form = $this->createForm('AppBundle\Form\OrderingType', $ordering);
        $form->handleRequest($request);
        // END handle request wth ordering form
        if ($form->isSubmitted()) {


            return $this->forward('AppBundle:Default:orderingFinish', [
                'name' => $ordering->getName(),
                'phone' => $ordering->getPhone(),
                'quantity' => $ordering->getQuantity()
            ]);

        }


        // return index homepage
        return $this->render('default/index.html.twig', [
            'form' => $form->createView(),
//            'navbar' => true,
        ]);
    }

    public function orderingFinishAction($name, $phone, $quantity)
    {

        //  send email to admin
        $message = (new \Swift_Message(' First step Order , Phone: '.$phone.', Name: '.$name ))
            ->setFrom('torofluxinfo@gmail.com')
            ->setTo('torofluxinfo@gmail.com')
            ->setBody(
               'name - '.$name.'<br> phone - '.$phone.'<br> quantity -'.$quantity,
                'text/html'
            );
        $this->get('mailer')->send($message);
        // END send email to admin


        $ordering = new Ordering();

        $ordering->setName($name);
        $ordering->setPhone($phone);
        $ordering->setQuantity($quantity);
        $ordering->setDeliveryType('self_checkout');
        $ordering->setPaymentMethod('by_card');
        $ordering->setPrice($ordering->getQuantity() * 189);

        $form = $this->createForm('AppBundle\Form\FinishOrderType', $ordering, [
            'method' => 'POST',
            'action' => $this->generateUrl('ordering_finish2')
        ]);

        return $this->render('ordering/finishOrder.html.twig', [
            'form' => $form->createView(),
            'ordering' => $ordering,
        ]);
    }

    public function orderingFinish2Action(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $ordering = new Ordering();
        $form = $this->createForm('AppBundle\Form\FinishOrderType', $ordering);

        $form->handleRequest($request);
//        dump($form);die;

        if ($form->isSubmitted() && $form->isValid()) {

            //  save Ordering Entity to db

            $ordering->setIpAddress($request->getClientIp());
            $ordering->setDate(new \DateTime('now'));
            $ordering->setStatus('new');
            $ordering->setLink(md5($ordering->getPhone() . microtime()));

            $em->persist($ordering);
            $em->flush();
            // END save Ordering Entity to db

            //  send email to admin
            $message = (new \Swift_Message(' NEW ORDER. Phone:'.$ordering->getPhone().',Name: '.$ordering->getName().', Order id = ' . $ordering->getId() . ' !'))
                ->setFrom('torofluxinfo@gmail.com')
                ->setTo('torofluxinfo@gmail.com')
                ->setBody(
                    $this->render('email/orderDetails.html.twig', ['ordering' => $ordering]),
                    'text/html'
                );
            $this->get('mailer')->send($message);
            // END send email to admin

            // return order details and confirmation
            return $this->redirectToRoute('ordering_details', [
                'link' => $ordering->getLink(),
            ]);
        }

        return $this->render('ordering/finishOrder.html.twig', [
            'form' => $form->createView(),
            'ordering' => $ordering,

        ]);
    }

    /**
     * @ParamConverter("ordering", class="AppBundle:Ordering", options={"id" = "link", "repository_method" = "findByLink" } )
     */
    public function orderingDetailsAction(Request $request, Ordering $ordering)
    {
        $em = $this->getDoctrine()->getManager();
        $sendMailForm = $this->createFormBuilder()
            ->add('email', EmailType::class,[
                'label'=>'email'
            ])
            ->getForm();

        $sendMailForm->handleRequest($request);
//        dump($sendMailForm->get('email')->getData());die;

        if($sendMailForm->isSubmitted()&&$sendMailForm->isValid()){
            $ordering->setEmail($sendMailForm->get('email')->getData());
            $em->persist($ordering);
            $em->flush();

            //  send email to customer
            $message = (new \Swift_Message('ТОРОФЛАКС Деталі замовлення № 495' . $ordering->getId() . ' !'))
                ->setFrom('torofluxinfo@gmail.com')
                ->setTo($ordering->getEmail())
                ->setBody(
                    $this->render('email/orderConfirm.html.twig', ['ordering' => $ordering]),
                    'text/html'
                );
            $this->get('mailer')->send($message);
            // END send email to customer


           return $this->redirectToRoute('ordering_details', ['link' => $ordering->getLink()]);
        }
        return $this->render('/ordering/orderDetails.html.twig', [
            'ordering' => $ordering,
            'sendMailForm' => $sendMailForm->createView()
        ]);

        return $this->redirectToRoute('homepage');
    }
}
