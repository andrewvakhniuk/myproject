<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Ordering;
use AppBundle\Entity\Visit;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DefaultController extends Controller
{

    public function orderingDetailsAction(Request $request)
    {
        $id = $this->get('session')->get('ordering_id');
//        $id = $request->query->get('id');
//        dump($id);die;
        if ($id !== null) {
            $ordering = $this->getDoctrine()->getManager()->getRepository('AppBundle:Ordering')->find((int)$id);
            if($ordering){
                return $this->render('/ordering/orderDetails.html.twig', [
                    'ordering' => $ordering,
                ]);
            }
        }
        return $this->redirectToRoute('homepage');
    }

    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        // save ip address to visits
        $visit = new Visit();
        $visit->setDate(new \DateTime('now'));
        $visit->setIp($request->getClientIp());
        $em->persist($visit);
        $em->flush();
        // END save ip address to visits

        // handle request wth ordering form
        $ordering = new Ordering();
        $form = $this->createForm('AppBundle\Form\OrderingType', $ordering);
        $form->handleRequest($request);
        // END handle request wth ordering form

        if ($form->isSubmitted() && $form->isValid()) {

            //  save Ordering Entity to db
            $ordering->setIpAddress($request->getClientIp());
            $ordering->setDate(new \DateTime('now'));
            $ordering->setStatus('new');
            $em->persist($ordering);
            $em->flush();
            // END save Ordering Entity to db

            $translator = $this->get('translator');

            //  send email to customer
            $message = (new \Swift_Message($translator->trans('email.order.details') .' '. $translator->trans('order.id').' 495'.$ordering->getId().' !'))
                ->setFrom('torofluxinfo@gmail.com')
                ->setTo($ordering->getEmail())
                ->setBody(
                    $this->render('email/orderConfirm.html.twig', ['ordering' => $ordering]),
                    'text/html'
                );
            $this->get('mailer')->send($message);
            // END send email to customer
            //  send email to admin
            $message = (new \Swift_Message(' NEW ORDER. Order id = '.$ordering->getId().' !'))
                ->setFrom('torofluxinfo@gmail.com')
                ->setTo('torofluxinfo@gmail.com')
                ->setBody(
                    $this->render('email/orderDetails.html.twig', ['ordering' => $ordering]),
                    'text/html'
                );
            $this->get('mailer')->send($message);
            // END send email to admin

            $this->get('session')->set('ordering_id', $ordering->getId());
            // return order details and confirmation
            return $this->redirectToRoute('ordering_details', [
//                'id' => $ordering->getId(),
            ]);
        }

        // return index homepage
        return $this->render('default/index.html.twig', [
            'form' => $form->createView(),
            'navbar' => true,
        ]);
    }
}
